var backWords = new Set();

backWords.add("しりとり");

function confirmedMyWord() {
    if (checkWord()) {
        addWord();
    }
    else {
    }

    return false;
}

function checkWord() {
    if (checkHiragana() && checkConnect() && checkUsed()) {
        console.log("OK!");
        return true;
    }
    else {
        console.log("NO!");
        return false;
    }
}

function checkHiragana() {
    const myWord = document.getElementById("my_word_input").value;

    if (myWord == null)
        return false;

    if (myWord.match(/^[ぁ-んー　]*$/)) {
        return true;
    } else {
        return false;
    }
}

function checkConnect() {
    const myWord = document.getElementById("my_word_input").value;
    const backestWord = document.getElementById("back_words_head").innerHTML;

    console.log(backestWord + " -> " + myWord);
    console.log(backestWord.slice(-1) + " -> " + myWord.slice(0, 1));

    return backestWord.slice(-1) == myWord.slice(0, 1);
}

function checkUsed() {
    const myWord = document.getElementById("my_word_input").value;

    return !backWords.has(myWord);
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

    const back_words_head_el = document.getElementById("back_words_head");

    const backWordsElement = document.getElementById("back_words");
    backWordsElement.insertBefore(newBackWordElement, back_words_head_el);

    back_words_head_el.removeAttribute("id");
    newBackWordElement.id = "back_words_head";
}