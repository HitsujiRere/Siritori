function confirmed_my_word() {
    if (check_words()) {
        console.log("OK!");
        add_words();
    }
    else {
        console.log("NO!");
    }
}

function check_words() {
    var my_word = document.getElementById("my_word_input").value;
    var back_words_head = document.getElementById("back_word_head").innerHTML;

    console.log(back_words_head + " -> " + my_word);
    console.log(back_words_head.slice(-1) + " -> " + my_word.slice(0, 1));

    if (back_words_head.slice(-1) == my_word.slice(0, 1)) {
        return true;
    }
    else {
        return false;
    }
}

function add_words() {
    var my_word = document.getElementById("my_word_input").value;
    var my_word_el = document.createTextNode(my_word);

    document.getElementById("backest_word").innerHTML = my_word;

    var new_back_word_el = document.createElement("li");
    new_back_word_el.appendChild(my_word_el);

    var back_words_head_el = document.getElementById("back_word_head");

    var back_words_el = document.getElementById("back_words");
    back_words_el.insertBefore(new_back_word_el, back_words_head_el);

    back_words_head_el.id = "";
    new_back_word_el.id = "back_word_head";

    document.getElementById("my_word_input").value = "";
}