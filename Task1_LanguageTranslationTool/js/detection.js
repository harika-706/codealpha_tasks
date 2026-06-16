function detectRomanizedLanguage(text){

    const t = text.toLowerCase().trim();

    if(t.includes("annyeong")) return "ko";
    if(t.includes("saranghae")) return "ko";
    if(t.includes("gamsahamnida")) return "ko";

    if(t.includes("ni hao")) return "zh-CN";
    if(t.includes("xie xie")) return "zh-CN";
    if(t.includes("zai jian")) return "zh-CN";

    if(t.includes("konnichiwa")) return "ja";
    if(t.includes("arigatou")) return "ja";
    if(t.includes("ohayou")) return "ja";

    if(t.includes("privet")) return "ru";
    if(t.includes("spasibo")) return "ru";

    if(t.includes("marhaba")) return "ar";
    if(t.includes("shukran")) return "ar";

    return null;
}

async function detectLanguage(text) {

    // First check romanized patterns
    const romanized = detectRomanizedLanguage(text);
    if (romanized) return romanized;

    try {
        const url =
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;

        const r = await fetch(url);
        const d = await r.json();

        let detected = d?.[2] || null;

        const supported = [
            'te','hi','ta','kn','ml','bn','mr',
            'en','fr','de','es','pt','it',
            'ja','zh-CN','ko','ar','ru'
        ];

        if (supported.includes(detected)) {
            return detected;
        }

        return 'en'; // fallback only to English
    }
    catch(e){
        console.error(e);
        return 'en';
    }
}

function showDetectedBadge(langCode) {
  const badge = document.getElementById('detectedBadge');
  const name = LANG_NAMES[langCode] || langCode;
  badge.textContent = '🌐 Detected: ' + name;
  badge.classList.add('show');
}

function hideDetectedBadge() {
  const badge = document.getElementById('detectedBadge');
  badge.classList.remove('show');
  badge.textContent = '';
}
