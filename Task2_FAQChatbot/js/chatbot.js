import { SMALL_TALK } from "./smallTalk.js";
import { detectScam } from "./scamDetector.js";
import { semanticSearch, faqEmbeddings } from "./semanticSearch.js";
import { addMsg, showTyping, hideTyping } from "./ui.js";
import { getIncidentResponse }
from "./incidentResponse.js";

let lastFAQ = null;

function checkSmallTalk(text) {

const lower =
text.toLowerCase()
.trim()
.replace(/[^a-z0-9\s]/g,'');

for (const group of SMALL_TALK) {

if (
group.patterns.some(p => {

if (p.includes(" ")) {
return lower.includes(p);
}

return lower
.split(/\s+/)
.includes(p);

})
) {

return group.responses[
Math.floor(
Math.random() *
group.responses.length
)
];

}
}

return null;
}

function checkContextQuery(text){

if(!lastFAQ)
return null;

const q =
text.toLowerCase();

if(lastFAQ.q.includes("phishing")){

if(q.includes("example")){

return "Example: A fake bank email asking you to verify your password or OTP is a phishing attack.";

}

}

if(lastFAQ.q.includes("strong password")){

if(q.includes("example")){

return "Example strong password: G7@kL9#xP2!mQ8";

}

}

return null;
}

function speak(text){

    window.speechSynthesis.cancel();

    const speech =
    new SpeechSynthesisUtterance(text);

    speech.rate = 1;

    window.speechSynthesis.speak(speech);
}

export async function ask(q){

if (
!window.featureExtractor ||
faqEmbeddings.length === 0
) {

addMsg(
'bot',
"I'm still loading my knowledge base. Please wait a few seconds and try again."
);

return;
}

q = q.trim();

if (!q)
return;

addMsg('user', q);
const incident =
getIncidentResponse(q);

if (incident) {

    addMsg(
        'bot',
        incident
    );

    return;
}


const scam = detectScam(q);

if (scam) {

    addMsg(
        "bot",
        `⚠ Scam Analysis

Risk Level: ${scam.risk}

Indicators Found:
${scam.reasons.map(r => "• " + r).join("\n")}

Recommendation:
Do not share passwords, OTPs, CVV numbers, or banking information.`
    );

    return;
}

const sendBtn =
document.getElementById(
"sendBtn"
);

sendBtn.disabled = true;

showTyping();

await new Promise(
r => setTimeout(
r,
400 + Math.random()*300
)
);

hideTyping();

const contextReply =
checkContextQuery(q);

if(contextReply){

addMsg(
'bot',
contextReply
);

sendBtn.disabled = false;

return;
}

const smallTalkReply =
checkSmallTalk(q);

if(
smallTalkReply &&
q.trim().split(/\s+/).length <= 3
){

addMsg(
'bot',
smallTalkReply
);

sendBtn.disabled = false;

return;
}

if(q.toLowerCase().includes("otp")){

addMsg(
'bot',
'Never share your OTP with anyone. Banks, government agencies, and legitimate companies will never ask for your OTP.'
);

sendBtn.disabled = false;
return;
}

try {

const result =
await semanticSearch(q);

if(result){

const {
faq,
score
} = result;

lastFAQ = faq;

addMsg(
'bot',
faq.a,
score
);

speak(faq.a);

sendBtn.disabled = false;

return;
}

}
catch(error){

console.error(error);

addMsg(
'bot',
'Something went wrong while searching.'
);

sendBtn.disabled = false;

return;
}

addMsg(
'bot',
"Sorry, I couldn't find an answer. Try rephrasing your question."
);

sendBtn.disabled = false;
}
