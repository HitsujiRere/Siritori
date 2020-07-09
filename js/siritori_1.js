
// 以前使用した単語たち
const backWords = new Set();

// 繋がった回数
let connectTime = 0;

// メッセージテキスト
let messageText = "";

window.onload = function () {
    // 最初の単語
    const firstWord = "しりとり";

    // 最初の単語の設定
    document.getElementById("back_word").innerHTML = firstWord;
    backWords.add(firstWord);

    // ツイートボタンの初期化
    updateTweetText();
};

// 単語の入力を感知する
function confirmedMyWord() {
    const myWord = document.getElementById("my_word_input").value;

    // 単語が入力されていないなら終わる
    if (myWord == "") {
        return false;
    }

    // 入力した単語が正しいか調べる
    if (checkMyWord()) {
        // 単語の追加
        addWord();
        // ツイートする文の更新
        updateTweetText();
    }

    // メッセージの更新
    updateMessage();

    return false;
}

// 入力された単語が正しいか確かめる
function checkMyWord() {
    if (checkHiragana() && checkConnect() && checkNotUsed()) {
        console.log("OK!");

        connectTime++;
        messageText = `${connectTime}個目！`;

        return true;
    }
    else {
        console.log("NO!");

        return false;
    }
}

// 全てひらがなかどうか
function checkHiragana() {
    const myWord = document.getElementById("my_word_input").value;

    if (myWord == null) {
        messageText = "空文字です";

        return false;
    }

    if (myWord.match(/^[ぁ-んー]*$/)) {
        return true;
    } else {
        messageText = "ひらがなではありません";

        return false;
    }
}

// 前の単語と繋がっているか
function checkConnect() {
    const myWord = document.getElementById("my_word_input").value;
    const backWord = document.getElementById("back_word").innerHTML;

    console.log(backWord + " -> " + myWord);
    console.log(backWord.slice(-1) + " -> " + myWord.slice(0, 1));

    if (backWord.slice(-1) == myWord.slice(0, 1)) {
        return true;
    } else {
        messageText = "前の単語と繋がりません";
        return false;
    }
}

// 使われていないか調べる
function checkNotUsed() {
    const myWord = document.getElementById("my_word_input").value;

    if (!backWords.has(myWord)) {
        return true;
    } else {
        messageText = "既に使用されています";
        return false;
    }
}

// 単語を追加する
function addWord() {
    const myWord = document.getElementById("my_word_input").value;

    addWordToBackWords();

    document.getElementById("back_word").innerHTML = myWord;

    document.getElementById("my_word_input").value = "";

    backWords.add(myWord);
}

// 過去への単語の追加
function addWordToBackWords() {
    const myWord = document.getElementById("my_word_input").value;
    const myWordElement = document.createTextNode(myWord);

    const newBackWordElement = document.createElement("li");
    newBackWordElement.appendChild(myWordElement);

    const backWordsElement = document.getElementById("back_words");
    backWordsElement.insertBefore(newBackWordElement, backWordsElement.firstChild);
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
// 任意のタイミングで呼べば狙ったとおりのテキストのボタンつくれる
// 引数増やしていろいろやってもよいですね。
function setTweetButton(text) {
    //$('#tweet-area').empty(); //既存のボタン消す
    document.getElementById("tweet-area").textContent = null;
    // htmlでスクリプトを読んでるからtwttがエラーなく呼べる
    // オプションは公式よんで。
    twttr.widgets.createShareButton(
        "",
        document.getElementById("tweet-area"),
        {
            size: "large", //ボタンはでかく
            text: text, // 狙ったテキスト
            //hashtags: "１人しりとり", // ハッシュタグ
            //url: url // URL
        }
    );
}