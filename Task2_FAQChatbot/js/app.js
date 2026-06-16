import { pipeline }
from "https://cdn.jsdelivr.net/npm/@xenova/transformers";

import { buildFAQEmbeddings }
from "./semanticSearch.js";

import { addMsg }
from "./ui.js";

import { ask }
from "./chatbot.js";

import { initializeVoice }
from "./voice.js";

window.featureExtractor =
await pipeline(
"feature-extraction",
"Xenova/all-MiniLM-L6-v2"
);

console.log(
"Embedding model loaded"
);

await buildFAQEmbeddings();

document.getElementById(
"loading"
).style.display = "none";

initializeVoice();


// Store current chat messages
window.currentChat = [];
console.log("CHAT CLEARED");
console.log(window.currentChat);
let chatSaved = false;

/* =========================
   DARK MODE
========================= */

const themeBtn =
document.getElementById(
"themeBtn"
);

if(
localStorage.getItem("darkMode")
=== "true"
){
document.body.classList.add("dark");
}

themeBtn.onclick = () => {

document.body.classList.toggle(
"dark"
);

localStorage.setItem(
"darkMode",
document.body.classList.contains(
"dark"
)
);

};


const chips = [
"What is phishing?",
"Strong password tips",
"What is ransomware?",
"How to stay safe online?"
];

const sugEl =
document.getElementById(
"suggestions"
);

chips.forEach(q => {

const btn =
document.createElement(
"button"
);

btn.className =
"chip";

btn.textContent =
q;

btn.onclick =
() => ask(q);

sugEl.appendChild(btn);

});

/* =========================
   INPUT EVENTS
========================= */

const sendBtn =
document.getElementById(
"sendBtn"
);

const inputEl =
document.getElementById(
"qInput"
);

sendBtn.onclick =
() => ask(
inputEl.value
);

inputEl.addEventListener(
"keydown",
e => {

if(
e.key === "Enter"
&& !sendBtn.disabled
){

ask(
inputEl.value
);

}

}
);

/* =========================
   WELCOME MESSAGE
========================= */

function showWelcomeMessage(){

addMsg(
"bot",

`🛡️ Welcome to Cyber Awareness Assistant!

I can help you learn about:

• Phishing Attacks
• Password Security
• Malware & Ransomware
• Social Engineering
• Safe Browsing
• Online Scams

Ask me any cybersecurity question.`
);

}

/* =========================
   CHAT HISTORY 
========================= */

document.getElementById("msgs").innerHTML = "";

showWelcomeMessage();

// Don't save welcome message
window.currentChat = [];

/* =========================
   HISTORY BUTTON
========================= */

document
.getElementById(
"historyBtn"
)
.onclick = () => {

const history =
JSON.parse(
localStorage.getItem(
"allChats"
)
) || [];

const content =
document.getElementById(
"historyContent"
);

content.innerHTML = "";

if(history.length === 0){

content.innerHTML =
"<p>No history available.</p>";

}
else{

history.forEach((chat,index)=>{

const div =
document.createElement(
"div"
);

div.className =
"history-item";

div.innerHTML = `

<h4>
${chat.title}
</h4>

<p>
${chat.date}
</p>

<button
class="loadHistory"
data-index="${index}">
Open Chat
</button>

`;

content.appendChild(div);

});

setTimeout(()=>{

document
.querySelectorAll(
".loadHistory"
)
.forEach(btn=>{

btn.onclick = ()=>{

const idx =
btn.dataset.index;

window.openHistoryChat(
idx
);

};

});

},0);

}

document
.getElementById(
"historyModal"
)
.style.display =
"flex";

};

/* =========================
   CLOSE HISTORY
========================= */

document
.getElementById(
"closeHistory"
)
.onclick = ()=>{

document
.getElementById(
"historyModal"
)
.style.display =
"none";

};

/* =========================
   VIEW HISTORY CHAT
========================= */

window.openHistoryChat =
function(index){

const history =
JSON.parse(
localStorage.getItem(
"allChats"
)
) || [];

if(!history[index]){
    return;
}

const messages =
history[index].messages;

let html = "";

messages.forEach(msg => {

html += `
<div style="
padding:8px;
margin-bottom:8px;
border-bottom:1px solid #e2e8f0;
">

<strong>
${msg.role.toUpperCase()}
</strong>

<br>

${msg.text}

</div>
`;

});

document
.getElementById(
"chatViewContent"
)
.innerHTML = html;

document
.getElementById(
"chatViewModal"
)
.style.display =
"flex";

};

document
.getElementById(
"closeChatView"
)
.onclick = ()=>{

document
.getElementById(
"chatViewModal"
)
.style.display =
"none";

};

/* =========================
   CLEAR CHAT
========================= */

document.getElementById("clearBtn")
.onclick = () => {

    saveCurrentChat();

    document.getElementById("msgs").innerHTML = "";

    // Completely start a new chat
    window.currentChat = [];
    chatSaved = false;

    showWelcomeMessage();

    // Remove welcome message from tracking
    window.currentChat = [];
};

function saveCurrentChat() {

    if(chatSaved){
        return;
    }

    const userMessages =
        window.currentChat.filter(
            msg => msg.role === "user"
        );

    if(userMessages.length === 0){
        return;
    }

    let history =
        JSON.parse(
            localStorage.getItem("allChats")
        ) || [];

    const firstUserMessage =
        window.currentChat.find(
            msg => msg.role === "user"
        );

    const title =
        firstUserMessage
            ? firstUserMessage.text.substring(0, 40)
            : "Cyber Chat";
    console.log("Saving chat:", title);

    console.log("Saving chat:");
    console.log(window.currentChat);
    history.push({

        id: Date.now(),

        title: title,

        date: new Date().toLocaleString(),

        messages: [...window.currentChat]

    });

    if(history.length > 50){
    history.shift();
    }

    localStorage.setItem(
        "allChats",
        JSON.stringify(history)
    );

    chatSaved = true;
}

window.addEventListener(
    "beforeunload",
    () => {

        if(window.currentChat.length > 0){
            saveCurrentChat();
        }

    }
);
