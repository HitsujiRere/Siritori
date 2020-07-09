const backWords = new Set();

backWords.add("しりとり");

let messageText = "";

function confirmedMyWord() {
    if (checkWord()) {
        addWord();
    }

    updateMessage();

    return false;
}

function checkWord() {
    if (checkHiragana() && checkConnect() && checkUsed()) {
        console.log("OK!");
        messageText = "正解";
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

function updateMessage() {
    const messageEl = document.getElementById("input_message");
    messageEl.innerHTML = messageText;
}