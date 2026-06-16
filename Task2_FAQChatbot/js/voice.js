import { addMsg } from "./ui.js";

export function initializeVoice() {

const voiceBtn =
document.getElementById("voiceBtn");

const inputEl =
document.getElementById("qInput");

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

if (!SpeechRecognition) {

voiceBtn.disabled = true;

addMsg(
'bot',
'Voice recognition is not supported in this browser.'
);

return;
}

const recognition =
new SpeechRecognition();

recognition.lang = "en-US";

voiceBtn.onclick = () => {
recognition.start();
};

recognition.onresult = (e) => {

inputEl.value =
e.results[0][0].transcript;

};

recognition.onerror = () => {

addMsg(
'bot',
'Unable to recognize speech. Please try again.'
);

};
}
