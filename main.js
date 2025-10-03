// script.js

const texts = {
    ja: {
        title: "UUIDジェネレーター ~UIDG~",
        placeholder: "ここにUUIDが表示されます",
        generate: "生成",
        copy: "コピー",
        copyAlert: "UUIDをコピーしました！"
    },
    en: {
        title: "UUID Generator ~UIDG~",
        placeholder: "UUID will appear here",
        generate: "Generate",
        copy: "Copy",
        copyAlert: "UUID copied!"
    }
};

const title = document.getElementById('title');
const uuidInput = document.getElementById('uuid');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const languageSelect = document.getElementById('languageSelect');

// 言語を適用する関数
function setLanguage(lang) {
    title.textContent = texts[lang].title;
    uuidInput.placeholder = texts[lang].placeholder;
    generateBtn.textContent = texts[lang].generate;
    copyBtn.textContent = texts[lang].copy;

    // 選択値をselectにも反映
    languageSelect.value = lang;

    // localStorageに保存
    localStorage.setItem('uuidLang', lang);
}

// ページロード時に保存済みの言語を取得
const savedLang = localStorage.getItem('uuidLang') || 'ja';
setLanguage(savedLang);

// 言語選択時のイベント
languageSelect.addEventListener('change', () => {
    setLanguage(languageSelect.value);
});

// UUID生成関数
function generateUUID() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

// 生成ボタンイベント
generateBtn.addEventListener('click', () => {
    uuidInput.value = generateUUID();
});

// コピー機能
copyBtn.addEventListener('click', () => {
    if (!uuidInput.value) return;
    uuidInput.select();
    document.execCommand('copy');
    alert(texts[languageSelect.value].copyAlert);
});
function isAdBlockEnabled(callback) {
    const bait = document.createElement('div');
    bait.className = 'adsbox'; // よくブロックされるクラス名
    bait.style.height = '1px';
    bait.style.width = '1px';
    bait.style.position = 'absolute';
    bait.style.top = '-1000px';
    document.body.appendChild(bait);

    // 少し遅れてチェック
    window.setTimeout(() => {
        const blocked = !bait || bait.offsetHeight === 0;
        document.body.removeChild(bait);
        callback(blocked);
    }, 100);
}

// アドブロック検出して動作変更
isAdBlockEnabled((adblockDetected) => {
    if (adblockDetected) {
        // ボタン無効化
        generateBtn.disabled = true;
        copyBtn.disabled = true;

        // アラート付きの代替イベント
        const alertMessage = '広告ブロッカーを無効にしてください。\nお使いのコンピューターは、広告ブロッカーを利用しています。\n広告ブロッカーを無効にしないと、このツールは使用できません。\nPlease disable your ad blocker.\nYour computer is using an ad blocker.\nYou will not be able to use this tool unless you disable your ad blocker.';

        generateBtn.addEventListener('click', () => alert(alertMessage));
        copyBtn.addEventListener('click', () => alert(alertMessage));
    }
});
