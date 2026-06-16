function loadVoices(){ allVoices = speechSynthesis.getVoices(); }
loadVoices();
speechSynthesis.onvoiceschanged = loadVoices;

function googleTTSAudio(text, locale) {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${locale}&client=tw-ob`;
  const a = new Audio(url);
  a.onplay  = () => setStatus('🔊 Speaking via Google TTS…');
  a.onended = () => setStatus('✅ Done speaking.');
  a.onerror = () => setStatus('⚠️ Voice not available. Try Chrome for best support.');
  a.play().catch(() => setStatus('⚠️ Could not play audio. Use Chrome for best language voice support.'));
}

function findVoice(langCode) {
  if (!allVoices.length) allVoices = speechSynthesis.getVoices();

  const locales = VOICE_LOCALES[langCode] || [langCode];

  for (const loc of locales) {
    const v = allVoices.find(
      x => x.lang.toLowerCase() === loc.toLowerCase()
    );

    if (v) return v;
  }

  const prefix = langCode.split('-')[0].toLowerCase();

  return allVoices.find(
    x => x.lang.toLowerCase().startsWith(prefix)
  ) || null;
}

function doSpeak(){
  const tgt = document.getElementById('tgtLang').value;
  const text = document.getElementById('resultText').value;

  if(!text){
    setStatus('⚠️ Nothing to speak yet.');
    return;
  }

  if(!window.speechSynthesis){
    setStatus('❌ Speech not supported.');
    return;
  }

  speechSynthesis.cancel();

  const utt = new SpeechSynthesisUtterance(text);

  const voice = findVoice(tgt);

  console.log("Target:", tgt);
  console.log("Voice found:", voice);

  if(!voice){
    googleTTSAudio(text, tgt);
    return;
  }

  utt.voice = voice;
  utt.lang = voice.lang;

  setStatus('🔊 Speaking…');

  utt.onend = () => setStatus('✅ Done speaking.');

  speechSynthesis.speak(utt);
}
