
import * as Siritori from './siritori.mjs';

// ツイートボタンの初期化
updateTweetText();

// 単語の入力を感知する
export function submitedMyWord() {
    const myWord = document.getElementById("my_word_input").value;

    // 単語が入力されていないなら終わる
    if (myWord == "" || !Siritori.isPlaying) {
        return;
    }

    // 入力した単語が正しいか調べる
    if (Siritori.checkWord(myWord)) {
        // 単語の追加
        Siritori.addWord(myWord);
        // ツイートする文の更新
        Siritori.updateTweetText();
        // 入力フォームを空にする
        document.getElementById("my_word_input").value = "";
    }
}


// ツイートするテキストの変更
function updateTweetText() {
    Siritori.setTweetButton(
        `１人しりとりで${Siritori.connectTime}回続きました！`
    );
}
