let translatedText = '';
let convertedScript = '';

let debounceTimer = null;
let liveTranslateTimer = null;
let detectTimer = null;

let lastDetectedLang = null;
let allVoices = [];

function setStatus(html){
    document.getElementById('status').innerHTML = html;
}

function showPreview(text){
    const p = document.getElementById('translitPreview');
    p.textContent = '→ ' + text;
    p.classList.add('show');
}

function hidePreview(){
    const p = document.getElementById('translitPreview');
    p.textContent = '';
    p.classList.remove('show');
}

function isEnglishInput(text){
    return /^[a-zA-Z\s.,!?'"0-9\-]+$/.test(text.trim());
}

function onInput(){
    clearTimeout(debounceTimer);
    clearTimeout(detectTimer);

    document.getElementById('resultText').value = '';
    translatedText = '';

    const raw = document.getElementById('inputText').value.trim();
    const src = document.getElementById('srcLang').value;

    if(src === 'auto'){

        if(raw.length >= 2){

            detectTimer = setTimeout(async ()=>{

                let detected = detectRomanizedLanguage(raw);

                if(!detected){
                    detected = await detectLanguage(raw);
                }

                if(detected){
                    lastDetectedLang = detected;
                    showDetectedBadge(detected);
                }else{
                    hideDetectedBadge();
                    lastDetectedLang = null;
                }

            },500);

        }else{
            hideDetectedBadge();
            lastDetectedLang = null;
        }

        document.getElementById('badge').style.display = 'none';
        hidePreview();
        convertedScript = '';

    }else{

        hideDetectedBadge();
        lastDetectedLang = null;

        if(
            NON_ENGLISH.includes(src) &&
            raw &&
            isEnglishInput(raw)
        ){

            document.getElementById('badge').style.display = 'inline-block';

            debounceTimer = setTimeout(async ()=>{

                const result = await convertScript(raw,src);

                if(result && result !== raw){
                    convertedScript = result;
                    showPreview(result);
                }else{
                    hidePreview();
                    convertedScript = '';
                }

            },200);

        }else{

            document.getElementById('badge').style.display = 'none';
            hidePreview();
            convertedScript = '';
        }
    }

    const liveBox = document.getElementById('liveTranslate');

    if(liveBox && liveBox.checked){

        clearTimeout(liveTranslateTimer);

        liveTranslateTimer = setTimeout(()=>{

            const txt =
                document.getElementById('inputText').value.trim();

            const tgt =
                document.getElementById('tgtLang').value;

            if(txt && tgt){
                doTranslate();
            }

        },1000);
    }
}

function doCopy(){

    const t = document.getElementById('resultText').value;

    if(!t){
        setStatus('⚠️ Nothing to copy yet.');
        return;
    }

    navigator.clipboard
        .writeText(t)
        .then(()=>setStatus('📋 Copied!'))
        .catch(()=>{

            const el =
                document.getElementById('resultText');

            el.select();
            document.execCommand('copy');

            setStatus('📋 Copied!');
        });
}

function doClear(){

    document.getElementById('inputText').value = '';
    document.getElementById('resultText').value = '';

    document.getElementById('badge').style.display = 'none';

    hidePreview();
    hideDetectedBadge();

    translatedText = '';
    convertedScript = '';
    lastDetectedLang = null;

    setStatus('');
}

function swapLangs(){

    const src = document.getElementById('srcLang');
    const tgt = document.getElementById('tgtLang');

    if(src.value === 'auto'){
        setStatus(
            '⚠️ Cannot swap when Auto Detect is selected. Please choose a source language first.'
        );
        return;
    }

    const tmp = src.value;
    const tgtVal = tgt.value;

    const srcHasTgt =
        [...src.options].some(o => o.value === tgtVal);

    const tgtHasSrc =
        [...tgt.options].some(o => o.value === tmp);

    if(srcHasTgt) src.value = tgtVal;
    if(tgtHasSrc) tgt.value = tmp;

    const inText =
        document.getElementById('inputText').value;

    const outText =
        document.getElementById('resultText').value;

    if(outText){
        document.getElementById('inputText').value = outText;
        document.getElementById('resultText').value = '';
        translatedText = '';
    }

    hidePreview();
    hideDetectedBadge();

    convertedScript = '';
    lastDetectedLang = null;
}

document.getElementById('tgtLang')
.addEventListener('change',()=>{

    const liveBox =
        document.getElementById('liveTranslate');

    if(
        liveBox &&
        liveBox.checked &&
        document.getElementById('inputText').value.trim()
    ){
        doTranslate();
    }
});

document.getElementById('srcLang')
.addEventListener('change',()=>{

    const liveBox =
        document.getElementById('liveTranslate');

    if(
        liveBox &&
        liveBox.checked &&
        document.getElementById('inputText').value.trim()
    ){
        doTranslate();
    }
});

document.addEventListener('keydown',(e)=>{

    if(e.ctrlKey && e.key === 'Enter'){
        doTranslate();
    }
});
