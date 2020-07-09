const backWords = new Set();

backWords.add("しりとり");

let connectTime = 0;

let messageText = "";

window.onload = function () {
    updateTweetText();
};

function confirmedMyWord() {
    if (checkWord()) {
        addWord();
        updateTweetText();
    }

    updateMessage();

    return false;
}

function checkWord() {
    if (checkHiragana() && checkConnect() && checkUsed()) {
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

function checkConnect() {
    const myWord = document.getElementById("my_word_input").value;
    const backestWord = document.getElementById("back_words_head").innerHTML;

    console.log(backestWord + " -> " + myWord);
    console.log(backestWord.slice(-1) + " -> " + myWord.slice(0, 1));

    if (backestWord.slice(-1) == myWord.slice(0, 1)) {
        return true;
    } else {
        messageText = "前の単語と繋がりません";
        return false;
    }
}

function checkUsed() {
    const myWord = document.getElementById("my_word_input").value;

    if (!backWords.has(myWord)) {
        return true;
    } else {
        messageText = "既に使用されています";
        return false;
    }
}

function addWord() {
    const myWord = document.getElementById("my_word_input").value;

    addWordToUl();

    document.getElementById("backest_word").innerHTML = myWord;

    document.getElementById("my_word_input").value = "";

    backWords.add(myWord);
}

function addWordToUl() {
    const myWord = document.getElementById("my_word_input").value;
    const myWordElement = document.createTextNode(myWord);

    const newBackWordElement = document.createElement("li");
    newBackWordElement.appendChild(myWordElement);

    const backWordsHeadEl = document.getElementById("back_words_head");

    const backWordsElement = document.getElementById("back_words");
    backWordsElement.insertBefore(newBackWordElement, backWordsHeadEl);

    backWordsHeadEl.removeAttribute("id");
    newBackWordElement.id = "back_words_head";
}

function updateTweetText() {
    setTweetButton(
        `１人しりとりで${connectTime}回続きました！`
    );
}

function updateMessage() {
    const messageEl = document.getElementById("input_message");
    messageEl.innerHTML = messageText;
}

// 任意のタイミングで呼べば狙ったとおりのテキストのボタンつくれる
// 引数増やしていろいろやってもよいですね。
// FROM: https://qiita.com/lovesaemi/items/d4f296b6b1d5158d2fea
// FIX : URLを任意のものに変更できない
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