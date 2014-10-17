# Lang Wars - JavaChallenge 2014

公式サイト
- http://www.ai-comp.net/javachallenge2014/
- http://icpc.iisf.or.jp/2014-waseda/

## インストール手順

### Windows

1. [node.js](http://nodejs.org/) のインストーラーをダウンロード＆実行
2. `install.bat` を実行

### Linux / Mac OS

1. [nodebrew](https://github.com/hokaccha/nodebrew) および nodejs をインストール
    1. `curl -L git.io/nodebrew | perl - setup`
    2. bashを使っている人は `echo "export PATH=$HOME/.nodebrew/current/bin:$PATH" >> .bashrc`  
       zshを使っている人は `echo "export PATH=$HOME/.nodebrew/current/bin:$PATH" >> .zshrc`
    3. bashを使っている人は `source ~/.bashrc`  
       zshを使っている人は `source ~/.zshrc`
    4. `nodebrew install stable`
    5. `nodebrew use stable`
2. `install.sh` を実行

### Mac OS (nodebrewを使わない場合)

1. [node.js](http://nodejs.org/) のインストーラーをダウンロード＆実行
2. `install.sh` を実行

## 実行手順

### ローカル環境での実行方法 via ブラウザ

1. `execute_on_browser.bat` or `execute_on_browser.sh` を実行
2. AI 0～3 の欄にAI実行用のコマンドを入力
3. "Run Game" をクリックしてゲームを開始

### ローカル環境での実行方法 via CUI

1. `execute_on_cui.bat -a "1つ目のAIの実行コマンド" -a "2つ目のAIの実行コマンド"` (or `execute_on_cui.sh ...`) のように、AIに使用するコマンドを指定して実行。
この例では、1つ目と2つ目のAIには指定した実行コマンドが使用され、3つ目と4つ目のAIにはデフォルトのコマンド（`node SampleAI/JavaScript/SampleAI.js`）が使用される。

## ライセンス

[NOTICE](NOTICE)を参照してください。
