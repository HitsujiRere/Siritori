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
    if (checkConnect() && checkUsed()) {
        console.log("OK!");
        return true;
    }
    else {
        console.log("NO!");
        return false;
    }
}

function checkConnect() {
    var myWord = document.getElementById("my_word_input").value;
    var backestWord = document.getElementById("back_words_head").innerHTML;

    console.log(backestWord + " -> " + myWord);
    console.log(backestWord.slice(-1) + " -> " + myWord.slice(0, 1));

    return backestWord.slice(-1) == myWord.slice(0, 1);
}

function checkUsed() {
    var myWord = document.getElementById("my_word_input").value;

    return !backWords.has(myWord);
}

function addWord() {
    var myWord = document.getElementById("my_word_input").value;

    addWordToUl();

    document.getElementById("backest_word").innerHTML = myWord;

    document.getElementById("my_word_input").value = "";

    backWords.add(myWord);
}

function addWordToUl() {
    var myWord = document.getElementById("my_word_input").value;
    var myWordElement = document.createTextNode(myWord);

    var newBackWordElement = document.createElement("li");
    newBackWordElement.appendChild(myWordElement);

    var back_words_head_el = document.getElementById("back_words_head");

    var backWordsElement = document.getElementById("back_words");
    backWordsElement.insertBefore(newBackWordElement, back_words_head_el);

    back_words_head_el.removeAttribute("id");
    newBackWordElement.id = "back_words_head";
}