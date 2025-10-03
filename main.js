const texts = {
  ja: {
    title: "UUIDジェネレーター ~UIDG~",
    placeholder: "ここにUUIDが表示されます",
    generate: "生成",
    copy: "コピー",
    copyAlert: "UUIDをコピーしました！",
    adblockOverlay: {
      heading: "📦 広告ブロック検出",
      line1: "お使いのコンピューターは、広告ブロッカーを利用しています。",
      line2: "広告ブロッカーを無効にしないと、このツールは使用できません。",
      link: "🔗 広告ブロッカーの無効化方法はこちら",
      linkUrl: "https://example.com/how-to-disable-adblock-ja",
      close: "閉じる",
      retry: "再チェック"
    }
  },
  en: {
    title: "UUID Generator ~UIDG~",
    placeholder: "UUID will appear here",
    generate: "Generate",
    copy: "Copy",
    copyAlert: "UUID copied!",
    adblockOverlay: {
      heading: "📦 Ad Blocker Detected",
      line1: "Your computer is using an ad blocker.",
      line2: "You must disable your ad blocker to use this tool.",
      link: "🔗 Click here to learn how to disable your ad blocker",
      linkUrl: "https://example.com/how-to-disable-adblock-en",
      close: "Close",
      retry: "Retry"
    }
  }
};

// DOM要素
const title = document.getElementById('title');
const uuidInput = document.getElementById('uuid');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const languageSelect = document.getElementById('languageSelect');
const themeSelect = document.getElementById('themeSelect');
const customColor = document.getElementById('customColor');
const customFontColor = document.getElementById('customFontColor');
const overlay = document.getElementById('adblockOverlay');
const overlayContent = document.getElementById('overlayContent');

let currentLang = localStorage.getItem('uuidLang') || (navigator.language.startsWith('en') ? 'en':'ja');
let currentTheme = localStorage.getItem('uuidTheme') || 'light';

// 言語設定
function setLanguage(lang){
  currentLang = lang;
  const t = texts[lang];
  title.textContent = t.title;
  uuidInput.placeholder = t.placeholder;
  generateBtn.textContent = t.generate;
  copyBtn.textContent = t.copy;
  languageSelect.value = lang;
  localStorage.setItem('uuidLang', lang);
  updateOverlay();
}

// テーマ適用
function applyTheme(theme){
  currentTheme = theme;
  document.body.className = theme; // クラスを切り替え
  localStorage.setItem('uuidTheme', theme);

  // カスタム色表示
  customColor.style.display = (theme==='custom')?'inline-block':'none';
  customFontColor.style.display = (theme==='custom')?'inline-block':'none';
  if(theme==='custom'){
    document.body.style.backgroundColor = customColor.value;
    document.body.style.color = customFontColor.value;
  }

  // **言語テキストも再適用**
  setLanguage(currentLang);
}


// UUID生成
function generateUUID(){
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>
    (c^crypto.getRandomValues(new Uint8Array(1))[0]&15>>c/4).toString(16)
  );
}

// AdBlock検出
function isAdBlockEnabled(callback){
  const bait = document.createElement('div');
  bait.className='adsbox';
  bait.style.cssText='height:1px;width:1px;position:absolute;top:-1000px;';
  document.body.appendChild(bait);
  setTimeout(()=>{
    const blocked=!bait||bait.offsetHeight===0;
    document.body.removeChild(bait);
    callback(blocked);
  },100);
}

// オーバーレイ更新
function updateOverlay(){
  const t = texts[currentLang].adblockOverlay;
  overlayContent.innerHTML=`
    <h2>${t.heading}</h2>
    <p>${t.line1}</p>
    <p>${t.line2}</p>
    <a href="${t.linkUrl}" target="_blank">${t.link}</a><br>
    <button id="retryBtn">${t.retry}</button>
    <button id="closeOverlayBtn">${t.close}</button>
  `;
  document.getElementById('closeOverlayBtn').onclick=()=>overlay.style.display='none';
  document.getElementById('retryBtn').onclick=()=>{
    console.log(`[LOG] ${currentLang} retry AdBlock check`);
    checkAdBlock();
  };
}

// AdBlockチェック
function checkAdBlock(){
  isAdBlockEnabled((blocked)=>{
    if(blocked){
      overlay.style.display='flex';
      generateBtn.disabled=true;
      copyBtn.disabled=true;
      console.log(`[LOG] AdBlock detected, lang:${currentLang}, theme:${currentTheme}`);
    }else{
      overlay.style.display='none';
      generateBtn.disabled=false;
      copyBtn.disabled=false;
      console.log(`[LOG] AdBlock not detected, lang:${currentLang}, theme:${currentTheme}`);
    }
  });
}

// 初期設定
setLanguage(currentLang);
applyTheme(currentTheme);
checkAdBlock();

// イベント
languageSelect.addEventListener('change', ()=>setLanguage(languageSelect.value));
themeSelect.addEventListener('change', ()=>applyTheme(themeSelect.value));
customColor.addEventListener('input', ()=>{if(currentTheme==='custom') document.body.style.backgroundColor=customColor.value;});
customFontColor.addEventListener('input', ()=>{if(currentTheme==='custom') document.body.style.color=customFontColor.value;});
generateBtn.addEventListener('click', ()=>uuidInput.value=generateUUID());
copyBtn.addEventListener('click', ()=>{
  if(!uuidInput.value) return;
  uuidInput.select();
  document.execCommand('copy');
  alert(texts[currentLang].copyAlert);
});

