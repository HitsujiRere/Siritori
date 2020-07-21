
// 単語マップ Map< string, Map<Word> >()
// 登場した単語は削除する
export const wordsMap = new Map();

// 以前使用した単語たち
export const backWords = new Set();

// 繋がった回数
export let connectTime = 0;

// メッセージテキスト
export let messageText = "";

// プレイ中かどうか
export let isPlaying = true;

// 前の単語の繋がる文字
export let backWordFoot = "";

export class Word {
    constructor(word_, mean_) {
        this.word = word_;
        this.mean = mean_;
    }
}

// 繋がる文字として使えない文字
const NGBackWordFootChars = [
    "ゃ", "ゅ", "ょ", "っ", "ー", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ",
];

/*****/

// 最初の単語
const firstWord = "しりとり";
addWord(firstWord);

/*****/

// 単語ファイルの読込む
function loadWordsMap() {
    convertCSVtoWordsMap(
        getFile("https://hitsujirere.github.io/Siritori/words.csv")
    );
}

// FROM: https://uxmilk.jp/11586
// ファイルを読込む
export function getFile(filePath) {
    const req = new XMLHttpRequest();
    let csvTxt = "";
    req.open("get", filePath, false);
    req.onload = function () {
        csvTxt = req.responseText;
    }
    req.send(null);
    return csvTxt;
}

// FROM: https://uxmilk.jp/11586
// 読み込んだCSVデータを単語マップに変換する
export function convertCSVtoWordsMap(csvTxt) {
    const csvSplited = csvTxt.split("\n");

    for (let i = 1; i < csvSplited.length; ++i) {
        const lineSplited = csvSplited[i].split(",");
        if (!wordsMap.has(lineSplited[0].slice(0, 1))) {
            wordsMap.set(lineSplited[0].slice(0, 1), new Map());
        }
        const word = new Word(lineSplited[0], lineSplited[1]);
        wordsMap.get(lineSplited[0].slice(0, 1)).set(lineSplited[0], word);
    }
}

export function makeWordsMapList() {
    // 単語マップのロード
    loadWordsMap();
    // 無の削除
    wordsMap.delete("");

    for (const [head, words] of wordsMap) {
        const wordsMapDetailsElement = document.getElementById("words_map");

        const headDetailsElement = document.createElement("details");
        wordsMapDetailsElement.appendChild(headDetailsElement);

        const headSummaryElement = document.createElement("summary");
        headDetailsElement.appendChild(headSummaryElement);

        const headTextNode = document.createTextNode(head);
        headSummaryElement.appendChild(headTextNode);

        const wordsUlElement = document.createElement("ul");
        headDetailsElement.appendChild(wordsUlElement);

        for (const [word, wordE] of words) {
            const wordLiElement = document.createElement("li");
            wordsUlElement.appendChild(wordLiElement);

            const wordTextNode = document.createTextNode(
                word + " : " + wordE.mean
            );
            wordLiElement.appendChild(wordTextNode);
        }
    }
}

// 単語が正しいか確かめる
export function checkWord(word) {
    if (checkHiragana(word) && checkViableWord(word) &&
        checkConnect(word) && checkNotUsed(word)) {
        connectTime++;

        if (checkContinue(word)) {
            console.log("OK!");

            setMessage("");
        }
        else {
            console.log("FINISH!");

            setMessage("負け！");

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
        setMessage("nullです");

        return false;
    }

    if (word.match(/^[ぁ-んー]*$/)) {
        return true;
    } else {
        setMessage("ひらがなではありません");

        return false;
    }
}

// 存在しうる単語かどうか
function checkViableWord(word) {
    // 2連続であるかどうか
    //console.log("([ゃゅょぁぃぅぇぉっー])\1+ = " + word.match(/^.*([ゃゅょぁぃぅぇぉっー])\1+.*$/));
    // [ゃゅょぁぃぅぇぉ]が連続して使われているか
    console.log("[ゃゅょぁぃぅぇぉ]{2,} = " + word.match(/^.*[ゃゅょぁぃぅぇぉ]{2,}.*$/));
    // [っー]が連続して使われているか
    console.log("([ーっ])\\1+ = " + word.match(/^.*([っー])\1+.*$/));
    // [っー]→[ゃゅょぁぃぅぇぉ]という順番で使われているか
    console.log("[っー][ゃゅょぁぃぅぇぉ] = " + word.match(/^.*[っー][ゃゅょぁぃぅぇぉ].*$/));
    // っ→ーという順番で使われているか
    console.log("(ー)(っ) = " + word.match(/^.*(ー)(っ).*$/));

    if (word.match(/^.*[ゃゅょぁぃぅぇぉ]{2,}.*$/) ||
        word.match(/^.*([ーっ])\1+.*$/) ||
        word.match(/^.*[っー][ゃゅょぁぃぅぇぉ].*$/) ||
        word.match(/^.*(ー)(っ).*$/)
    ) {
        setMessage("存在しうる単語ではありません");
        return false;
    }
    return true;
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
        setMessage("前の単語と繋がりません");
        return false;
    }
}

// 使われていないか調べる
function checkNotUsed(word) {
    if (!backWords.has(word)) {
        return true;
    } else {
        setMessage("既に使用されています");
        return false;
    }
}

// 単語リストのなかに存在しているか調べる
function checkExist(word) {
    if (wordsMap.has(word.slice(0, 1)) &&
        wordsMap.get(word.slice(0, 1)).has(word)) {
        return true;
    }
    else {
        return false;
    }
}

// まだ続くかどうか
export function checkContinue(word) {
    return word.slice(-1) != "ん";
}

// 単語を追加する
export function addWord(word) {
    updateBackWordFoot(word);

    addWordToBackWords(word);

    document.getElementById("back_word").innerHTML = word;
    document.getElementById("back_word_foot").innerHTML = backWordFoot;
    console.log(backWordFoot);

    backWords.add(word);
}

// 過去への単語の追加する
function addWordToBackWords(word) {
    const wordTextNode = document.createTextNode(
        word +
        (checkExist(word)
            ? " : " + wordsMap.get(word.slice(0, 1)).get(word).mean
            : "")
    );

    const wordLiElement = document.createElement("li");
    wordLiElement.appendChild(wordTextNode);

    const backWordsElement = document.getElementById("back_words");
    backWordsElement.insertBefore(wordLiElement, backWordsElement.firstChild);

    if (checkExist(word)) {
        wordsMap.get(word.slice(0, 1)).delete(word);
    }
}

// backWordFootを更新する
function updateBackWordFoot(word) {
    backWordFoot = word.slice(-1);

    let i = -2;
    while (NGBackWordFootChars.some(c => c == backWordFoot)) {
        backWordFoot = word.slice(i, i + 1);
        i--;
    }
}

// FROM: https://qiita.com/lovesaemi/items/d4f296b6b1d5158d2fea
// FIX : URLを任意のものに変更できない
export function setTweetButton(text) {
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

export function setMessage(txt) {
    messageText = txt;
    updateMessage();
}

export function addMessage(txt) {
    messageText += txt;
    updateMessage();
}

// メッセージの更新
function updateMessage() {
    const messageEl = document.getElementById("input_message");
    messageEl.innerHTML = messageText;
}

export function setIsPlaying(t) {
    isPlaying = t;
}