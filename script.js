// Web Audio APIのコンテキストを作成
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// 鍵盤要素を取得
const keys = document.querySelectorAll('.key');

// 事前に用意したおならの音のファイルパスを定義
// ファイル名とフォルダ名が正確であることを確認してください
const audioFiles = {
    'c3': 'onaraDRM/onara-do.wav',
    // 'c#3': 'onaraDRM/onara-do-sharp.wav', // 半音のファイルがない場合はこの行を削除
    'd3': 'onaraDRM/onara-re.wav',
    // 'd#3': 'onaraDRM/onara-re-sharp.wav',
    'e3': 'onaraDRM/onara-mi.wav',
    'f3': 'onaraDRM/onara-fa.wav',
    // 'f#3': 'onaraDRM/onara-fa-sharp.wav',
    'g3': 'onaraDRM/onara-so.wav',
    // 'g#3': 'onaraDRM/onara-so-sharp.wav',
    'a3': 'onaraDRM/onara-ra.wav',
    // 'a#3': 'onaraDRM/onara-ra-sharp.wav',
    'b3': 'onaraDRM/onara-si.wav',
    'c4': 'onaraDRM/onara-taka-do.wav',
};

// キーボードのキーと音をマッピング
const keyMap = {
    'a': 'c3',
    'w': 'c#3', // 黒鍵にキーを割り当て
    's': 'd3',
    'e': 'd#3', // 黒鍵にキーを割り当て
    'd': 'e3',
    'f': 'f3',
    't': 'f#3', // 黒鍵にキーを割り当て
    'g': 'g3',
    'y': 'g#3', // 黒鍵にキーを割り当て
    'h': 'a3',
    'u': 'a#3', // 黒鍵にキーを割り当て
    'j': 'b3',
    'k': 'c4'
};

// 音源ファイルを格納するオブジェクト
const samples = {};

// ページ読み込み時にすべての音源ファイルを読み込む非同期関数
async function loadAudioSamples() {
    for (const note in audioFiles) {
        try {
            const response = await fetch(audioFiles[note]);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            samples[note] = audioBuffer;
            console.log(`${note} の音源が読み込まれました`);
        } catch (error) {
            console.error(`${note} の音源の読み込みに失敗しました:`, error);
        }
    }
}

// 音源を再生する関数
function playSound(note) {
    if (samples[note]) {
        const source = audioContext.createBufferSource();
        source.buffer = samples[note];
        source.connect(audioContext.destination);
        source.start(0);
    }
}

// 鍵盤をクリックしたときの処理
keys.forEach(key => {
    key.addEventListener('mousedown', () => {
        const note = key.dataset.note;
        key.classList.add('playing');
        playSound(note);
    });
    key.addEventListener('mouseup', () => {
        key.classList.remove('playing');
    });
    key.addEventListener('mouseleave', () => {
        key.classList.remove('playing');
    });
});

// キーボードのキーを押したときの処理
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const note = keyMap[key];

    if (note) {
        const targetKey = document.querySelector(`[data-note="${note}"]`);
        if (targetKey && !targetKey.classList.contains('playing')) {
            targetKey.classList.add('playing');
            playSound(note);
        }
    }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    const note = keyMap[key];

    if (note) {
        const targetKey = document.querySelector(`[data-note="${note}"]`);
        if (targetKey) {
            targetKey.classList.remove('playing');
        }
    }
});

// ページ読み込み時に音源をロード
loadAudioSamples();