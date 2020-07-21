
import * as Siritori from './siritori.mjs';

Siritori.makeWordsMapList();

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
        updateTweetText();
        // 入力フォームを空にする
        document.getElementById("my_word_input").value = "";

        if (Siritori.isPlaying) {
            const enemyWordHead = Siritori.backWordFoot;
            console.log(enemyWordHead);

            if (Siritori.wordsMap.has(enemyWordHead) && Siritori.wordsMap.get(enemyWordHead).size > 0) {
                let rnd = Math.floor(Math.random() * Siritori.wordsMap.get(enemyWordHead).size);
                console.log(rnd);

                let enemyWord = "*****";
                let cnt = 0;
                for (const [word, wordE] of Siritori.wordsMap.get(enemyWordHead)) {
                    if (cnt == rnd) {
                        enemyWord = word;
                        break;
                    }
                    cnt++;
                }
                console.log(enemyWord);

                if (enemyWord == "*****") {
                    console.log("Error!");
                }

                // 単語の追加
                Siritori.addWord(enemyWord);

                Siritori.addMessage(` → CPUは「${enemyWord}」と返した！`);

                if (!Siritori.checkContinue(enemyWord)) {
                    Siritori.addMessage("勝利！");
                    Siritori.setIsPlaying(false);
                }
            }
            else {
                Siritori.addMessage(" → CPUはなにも返せない！勝利！");
                Siritori.setIsPlaying(false);
            }
        }
    }
}

// ツイートするテキストの変更
function updateTweetText() {
    Siritori.setTweetButton(
        `CPU対戦しりとりで${Siritori.connectTime}回続きました！`
    );
}
