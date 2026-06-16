async function googleGTX(text, src, tgt){
  const url=`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${src}&tl=${tgt}&dt=t&q=${encodeURIComponent(text)}`;
  const r=await fetch(url); if(!r.ok) throw new Error('HTTP '+r.status);
  const d=await r.json(); if(!d[0]) throw new Error('No data');

  if (src === 'auto' && d[2]) {
    lastDetectedLang = d[2];
    showDetectedBadge(d[2]);
  }
  const out=d[0].map(i=>(i[0]||'')).join('').trim(); if(!out) throw new Error('Empty');
  return out;
}

async function myMemory(text, src, tgt){
  const s=src==='zh-CN'?'zh':src==='auto'?'':src;
  const t=tgt==='zh-CN'?'zh':tgt;
  const pair = s ? `${s}|${t}` : `|${t}`;
  const url=`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pair}`;
  const r=await fetch(url); if(!r.ok) throw new Error('HTTP '+r.status);
  const d=await r.json();
  const out=(d?.responseData?.translatedText||'').trim();
  if(!out||out.toUpperCase().includes('PLEASE SELECT')||out.toLowerCase()===text.toLowerCase()) throw new Error('Bad');
  return out;
}

async function doTranslate(){
  const raw = document.getElementById('inputText').value.trim();
  if(!raw){ setStatus('⚠️ Please enter some text first.'); return; }
  const src = document.getElementById('srcLang').value;
  const tgt = document.getElementById('tgtLang').value;
  
  if(!tgt){ setStatus('⚠️ Please select a target language.'); return; }

  document.getElementById('translateBtn').disabled=true;
  setStatus('<span class="spinner"></span> Translating…');

  let textToTranslate = raw;
  let effectiveSrc = src;

  if (src === 'auto') {

    if (!lastDetectedLang) {
        const detected = await detectLanguage(raw);

        if (detected) {
            lastDetectedLang = detected;
            showDetectedBadge(detected);
        }
    }

    effectiveSrc = lastDetectedLang || 'auto';

    if (
        lastDetectedLang &&
        TRANSLIT_LANGS.has(lastDetectedLang) &&
        isEnglishInput(raw)
    ) {

        const script = await convertScript(raw, lastDetectedLang);

        console.log("SCRIPT:", script);

        if (script && script !== raw) {
            textToTranslate = script;
            convertedScript = script;
            showPreview(script);
        } else {
            textToTranslate = raw;
        }

    } else {
        textToTranslate = raw;
    }
}
   else {
    
    if(NON_ENGLISH.includes(src) && isEnglishInput(raw) && TRANSLIT_LANGS.has(src)){
      const script = convertedScript || await convertScript(raw, src);
      if(script && script !== raw){ textToTranslate=script; convertedScript=script; showPreview(script); }
    }
  }

  console.log("SOURCE:", effectiveSrc);
  console.log("TEXT:", textToTranslate);
  let result = null;
 
  try{ result = await googleGTX(textToTranslate, effectiveSrc, tgt); }catch(e){}
  if(!result){ try{ result = await googleGTX(textToTranslate,'auto',tgt); }catch(e){} }
  if(!result){ try{ result = await myMemory(textToTranslate, effectiveSrc, tgt); }catch(e){} }

  document.getElementById('translateBtn').disabled=false;
  if(result){ translatedText=result; document.getElementById('resultText').value=result; setStatus('✅ Translation complete!'); }
  else { setStatus('❌ Translation failed. Please check your internet connection and try again.'); }
}
