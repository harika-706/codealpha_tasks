export function addMsg(role, text, score) {

    const msgsEl =
        document.getElementById("msgs");

    const div =
        document.createElement("div");

    div.className =
        "msg " + role;

    const avatar =
document.createElement("div");

avatar.className =
"chat-avatar";

avatar.textContent =
role === "bot"
? "🛡️"
: "👤";

div.appendChild(avatar);

    const bub =
        document.createElement("div");

    bub.className =
        "bubble";

    bub.style.whiteSpace =
        "pre-line";

    bub.textContent =
    text;

div.appendChild(bub);

// Save message into current chat array
if (window.currentChat) {

    window.currentChat.push({
        role: role,
        text: text,
        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
    });
    console.log(window.currentChat);

}

    if (score !== undefined) {

        const pct =
            Math.round(score * 100);

        const level =
            pct >= 70 ? "high" :
            pct >= 40 ? "med" :
            "low";

        const label =
            pct >= 70 ? "High confidence" :
            pct >= 40 ? "Medium confidence" :
            "Low confidence";

        const tag =
            document.createElement("span");

        tag.className =
            "confidence conf-" + level;

        tag.textContent =
            `${label} · ${pct}%`;

        div.appendChild(tag);
    }

    const meta =
        document.createElement("div");

    meta.className =
        "meta";

    meta.textContent =
        new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    div.appendChild(meta);

   msgsEl.appendChild(div);

msgsEl.scrollTo({
    top: msgsEl.scrollHeight,
    behavior: "smooth"
});

saveChatHistory();
}

export function showTyping() {

    if (
        document.getElementById("typing")
    ) return;

    const msgsEl =
        document.getElementById("msgs");

    const div =
        document.createElement("div");

    div.className =
        "msg bot";

    div.id =
        "typing";

    const bub =
        document.createElement("div");

    bub.className =
        "bubble typing";

    for (let i = 0; i < 3; i++) {

        const dot =
            document.createElement("div");

        dot.className =
            "dot";

        bub.appendChild(dot);
    }

    div.appendChild(bub);

   msgsEl.appendChild(div);

msgsEl.scrollTo({
    top: msgsEl.scrollHeight,
    behavior: "smooth"
});


}

export function hideTyping() {

    const typing =
        document.getElementById("typing");

    if (typing) {
        typing.remove();
    }
}

function saveChatHistory() {
    // Disabled for now
}
