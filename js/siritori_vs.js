
// 単語マップ Map< string, Map<Word> >()
// 登場した単語は削除する
const wordsMap = new Map();

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

class Word {
    constructor(word_, mean_) {
        this.word = word_;
        this.mean = mean_;
    }
}

window.onload = function () {
    // 単語マップのロード
    loadWordsMap();
    // 無の削除
    wordsMap.delete("");
    // 単語マップの表示作成
    makeWordsMapList();

    // 最初の単語
    const firstWord = "しりとり";
    addWord(firstWord);

    // ツイートボタンの初期化
    updateTweetText();
};

// 単語ファイルの読込む
function loadWordsMap() {
    convertCSVtoWordsMap(
        getFile("https://hitsujirere.github.io/Siritori/words.csv")
    );
}

// FROM: https://uxmilk.jp/11586
// ファイルを読込む
function getFile(filePath) {
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
function convertCSVtoWordsMap(csvTxt) {
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

function makeWordsMapList() {
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

        if (isPlaying) {
            const enemyWordHead = backWordFoot;
            console.log(enemyWordHead);

            if (wordsMap.has(enemyWordHead) && wordsMap.get(enemyWordHead).size > 0) {
                let rnd = Math.floor(Math.random() * wordsMap.get(enemyWordHead).size);
                console.log(rnd);

                let enemyWord = "";
                let cnt = 0;
                console.log(`wordsMap.get(${enemyWordHead}).size = ${wordsMap.get(enemyWordHead).size}`);
                for (const [word, wordE] of wordsMap.get(enemyWordHead)) {
                    console.log(`cnt = ${cnt}`);
                    console.log(`word = ${word}`);
                    if (cnt == rnd) {
                        enemyWord = word;
                        break;
                    }
                    cnt++;
                }
                console.log(enemyWord);

                if (enemyWord == "") {
                    console.log("Error!");
                }

                // 単語の追加
                addWord(enemyWord);

                messageText += ` → CPUは「${enemyWord}」と返した！`;

                if (!checkContinue(enemyWord)) {
                    messageText += "勝利！"
                    isPlaying = false;
                }
            }
            else {
                messageText += " → CPUはなにも返せない！";

                messageText += "勝利！"
                isPlaying = false;
            }
        }
    }

    // メッセージの更新
    updateMessage();
}

// 単語が正しいか確かめる
function checkWord(word) {
    if (checkHiragana(word) && checkViableWord(word) &&
        checkConnect(word) && checkNotUsed(word)) {
        connectTime++;

        if (checkContinue(word)) {
            console.log("OK!");

            messageText = "";
        }
        else {
            console.log("FINISH!");

            messageText = "負け！";

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

// 存在しうる単語かどうか
function checkViableWord(word) {
    // 2連続であるかどうか
    //console.log("([ゃゅょぁぃぅぇぉっー])\1+ = " + word.match(/^.*([ゃゅょぁぃぅぇぉっー])\1+.*$/));
    // [ゃゅょぁぃぅぇぉ]が連続して使われているか
    console.log("[ゃゅょぁぃぅぇぉ]{2,} = " + word.match(/^.*[ゃゅょぁぃぅぇぉ]{2,}.*$/));
    // [っー]が連続して使われているか
    console.log("[ーっ]\\1+ = " + word.match(/^.*[ーっ]\1+.*$/));
    // [っー]→[ゃゅょぁぃぅぇぉ]という順番で使われているか
    console.log("[っー][ゃゅょぁぃぅぇぉ] = " + word.match(/^.*[っー][ゃゅょぁぃぅぇぉ].*$/));
    // っ→ーという順番で使われているか
    console.log("(ー)(っ) = " + word.match(/^.*(ー)(っ).*$/));

    if (word.match(/^.*[ゃゅょぁぃぅぇぉ]{2,}.*$/) ||
        word.match(/^.*[ーっ]\1+.*$/) ||
        word.match(/^.*[っー][ゃゅょぁぃぅぇぉ].*$/) ||
        word.match(/^.*(ー)(っ).*$/)
    ) {
        messageText = "存在しうる単語ではありません";
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

// 繋がる文字として使えない文字
const NGBackWordFootChars = [
    "ゃ", "ゅ", "ょ", "っ", "ー", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ",
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