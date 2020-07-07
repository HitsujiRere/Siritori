var back_words = new Set();

back_words.add("しりとり");

function confirmed_my_word() {
    if (check_word()) {
        add_word();
    }
    else {
    }

    return false;
}

function check_word() {
    if (check_connect() && check_used()) {
        console.log("OK!");
        return true;
    }
    else {
        console.log("NO!");
        return false;
    }
}

function check_connect() {
    var my_word = document.getElementById("my_word_input").value;
    var backest_word = document.getElementById("back_word_head").innerHTML;

    console.log(backest_word + " -> " + my_word);
    console.log(backest_word.slice(-1) + " -> " + my_word.slice(0, 1));

    return backest_word.slice(-1) == my_word.slice(0, 1);
}

function check_used() {
    var my_word = document.getElementById("my_word_input").value;

    return !back_words.has(my_word);
}

function add_word() {
    var my_word = document.getElementById("my_word_input").value;

    add_word_ul();

    document.getElementById("backest_word").innerHTML = my_word;

    document.getElementById("my_word_input").value = "";

    back_words.add(my_word);
}

function add_word_ul() {
    var my_word = document.getElementById("my_word_input").value;
    var my_word_el = document.createTextNode(my_word);

    var new_back_word_el = document.createElement("li");
    new_back_word_el.appendChild(my_word_el);

    var back_words_head_el = document.getElementById("back_word_head");

    var back_words_el = document.getElementById("back_words");
    back_words_el.insertBefore(new_back_word_el, back_words_head_el);

    back_words_head_el.removeAttribute("id");
    new_back_word_el.id = "back_word_head";
}