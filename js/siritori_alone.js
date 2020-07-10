
// 以前使用した単語たち
const backWords = new Set();

// 繋がった回数
let connectTime = 0;

// メッセージテキスト
let messageText = "";

// プレイ中かどうか
let isPlaying = true;

// 前の単語の繋がる文字
let backWordFoot = "";

window.onload = function () {
    // 最初の単語
    const firstWord = "しりとり";
    addWord(firstWord);

    // ツイートボタンの初期化
    updateTweetText();
};

// 単語の入力を感知する
function submitedMyWord() {
    const myWord = document.getElementById("my_word_input").value;

    // 単語が入力されていないなら終わる
    if (myWord == "" || !isPlaying) {
        return;
    }

    // 入力した単語が正しいか調べる
    if (checkWord(myWord)) {
        // 単語の追加
        addWord(myWord);
        // ツイートする文の更新
        updateTweetText();
        // 入力フォームを空にする
        document.getElementById("my_word_input").value = "";
    }

    // メッセージの更新
    updateMessage();
}

// 単語が正しいか確かめる
function checkWord(word) {
    if (checkHiragana(word) && checkConnect(word) && checkNotUsed(word)) {
        connectTime++;

        if (checkContinue(word)) {
            console.log("OK!");

            messageText = `${connectTime}個目！`;
        }
        else {
            console.log("FINISH!");

            messageText = `${connectTime}個で終了！`;

            isPlaying = false;
        }

        return true;
    }
    else {
        console.log("NO!");

        return false;
    }
}

// 全てひらがなかどうか
function checkHiragana(word) {
    if (word == null) {
        messageText = "nullです";

        return false;
    }

    if (word.match(/^[ぁ-んー]*$/)) {
        return true;
    } else {
        messageText = "ひらがなではありません";

        return false;
    }
}

// 前の単語と繋がっているか
function checkConnect(word) {

    if (backWordFoot == "") {
        return true;
    }

    console.log(backWordFoot + " -> " + word.slice(0, 1));

    if (backWordFoot == word.slice(0, 1)) {
        return true;
    } else {
        messageText = "前の単語と繋がりません";
        return false;
    }
}

// 使われていないか調べる
function checkNotUsed(word) {
    if (!backWords.has(word)) {
        return true;
    } else {
        messageText = "既に使用されています";
        return false;
    }
}

// まだ続くかどうか
function checkContinue(word) {
    return word.slice(-1) != "ん";
}

// 単語を追加する
function addWord(word) {
    updateBackWordFoot(word);

    addWordToBackWords(word);

    document.getElementById("back_word").innerHTML = word;
    document.getElementById("back_word_foot").innerHTML = backWordFoot;
    console.log(backWordFoot);

    backWords.add(word);
}

// 過去への単語の追加する
function addWordToBackWords(word) {
    const wordElement = document.createTextNode(word);

    const newBackWordElement = document.createElement("li");
    newBackWordElement.appendChild(wordElement);

    const backWordsElement = document.getElementById("back_words");
    backWordsElement.insertBefore(newBackWordElement, backWordsElement.firstChild);
}

// 繋がる文字として使えない文字
const NGBackWordFootChars = [
    "ゃ", "ゅ", "ょ", "っ", "ー",
];
// backWordFootを更新する
function updateBackWordFoot(word) {
    backWordFoot = word.slice(-1);

    let i = -2;
    while (NGBackWordFootChars.some(c => c == backWordFoot)) {
        backWordFoot = word.slice(i, i + 1);
        i--;
    }
}

// ツイートするテキストの変更
function updateTweetText() {
    setTweetButton(
        `１人しりとりで${connectTime}回続きました！`
    );
}

// メッセージの更新
function updateMessage() {
    const messageEl = document.getElementById("input_message");
    messageEl.innerHTML = messageText;
}

// FROM: https://qiita.com/lovesaemi/items/d4f296b6b1d5158d2fea
// FIX : URLを任意のものに変更できない
function setTweetButton(text) {
    //既存のボタンを消去
    document.getElementById("tweet-area").textContent = null;
    // 新しいボタンの作成
    twttr.widgets.createShareButton(
        "",
        document.getElementById("tweet-area"),
        {
            size: "large",
            text: text,
            //hashtags: "１人しりとり",
            //url: url,
        }
    );
}