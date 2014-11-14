# Negotiate and Conquer: SamurAI Coding 2014 ゲームルール

## 概要

あなたは戦国大名。
旗幟を鮮明にしない中立の領主たちを交渉で味方に引き入れて、勝利を手にしろ！

## ゲームの目的

_中立領主_との_交渉_を通じて_親密度_を上げることで領主の_兵力_を獲得し、全_大名_の中で最大の_総兵力_を得ることが目的である。
総兵力はゲームの中間と最後の2回に渡って獲得する。
各時点において、親密度が全大名中最大である領主の兵力の計から、親密度が最小である領主の兵力の計を引いた数が総兵力に加算される。

## ゲームの進行

末尾にゲームの進行を司るシステムの[擬似コード](#PseudoCode)も掲げています。

### 初期状態

大名は4人、中立領主は6人いる。
プレイヤは大名を制御する。
各中立領主の兵力は 3, 4, 5, 6 のいずれかの値にランダムに設定され、開示される。

### ターンと交渉

ゲームは_昼ターン_と_夜ターン_を繰り返す9ターンからなる。
最初は昼ターンである。

各ターンで大名は中立領主を選択し交渉する。
交渉は昼ターンには5回、夜ターンには2回行う。
同一ターンで同じ中立領主と何回交渉してもよい。
昼ターンでは大名が領主と交渉した回数、夜ターンでは大名が領主と交渉した回数の2倍、その大名と領主の親密度が向上する。
全ターンでの親密度向上の合計が、その大名と領主との親密度となる。

昼ターンの後には、どの大名がどの領主と何度交渉したのかが、すべて開示される。
夜ターンの後には、各領主が受けた交渉の回数のみを開示し、どの大名が交渉したのかは秘密にされる。

なお、第5ターン(3回目の昼ターン)の終了時には、秘匿されていたそれまでの2度の夜ターンにどの大名がどの領主と交渉したかの情報が開示される。

### 総兵力の計算

第5ターンおよび第9ターンの終了時に、各大名の総兵力が計算される。
各大名の総兵力に、親密度が全大名中である領主の兵力の計から、親密度最小である領主の兵力の計を引いたものが加算される。
ある領主について親密度最大あるいは最小の大名が複数ある場合、領主の兵力を最大/最小の大名の数で割ったものが各大名の総兵力に加算/減算される。
第5ターンに獲得した総兵力はその後も保持され、第9ターンに獲得する総兵力がそれに加算される。

## ゲームの勝敗

第9ターンの終了後、最大の総兵力を持つ大名がゲームの勝者となる。
最大の総兵力を持つ大名が二人以上いる場合、ゲームは引き分けになる。

## AIの入出力形式

AIはゲーム開始時に実行される。
ゲームを始める準備ができたら`READY`と出力したのち、ゲームの設定を入力として受け取る。
また、ターンごとに現在の情報を入力として受け取り、そのターンでの交渉相手を出力する。

AIの思考時間には制限がある。
制限時間を超過するとAIプログラムが強制的に停止され、それ以降のターンの行動はすべて「0番の領主と交渉する」として処理される。

### 準備完了メッセージの出力形式

ゲームを開始する準備ができたら、`READY`と標準出力に出力する。
ゲーム開始から5秒以内に出力がなければ、AIプログラムが強制的に停止される。

### ゲーム設定の入力形式

ゲーム開始時、つまり1ターン目の初めに、ゲームの設定が以下のフォーマットで標準入力に渡される。

<pre>
T D L
M<sub>0</sub> M<sub>1</sub> M<sub>2</sub> ... M<sub>5</sub>
</pre>

* T: 全ターン数。
* D: 大名の数。
* L: 領主の数。
* M<sub>i</sub>: 領主iの兵力。

### ターン情報の入力形式

各ターンの初めに、現在の情報が以下のフォーマットで標準入力に渡される。

<pre>
T P
I<sub>00</sub>　I<sub>01</sub> I<sub>02</sub> I<sub>03</sub>
I<sub>10</sub>　I<sub>11</sub> I<sub>12</sub> I<sub>13</sub>
I<sub>20</sub>　I<sub>21</sub> I<sub>22</sub> I<sub>23</sub>
:
:
I<sub>50</sub>　I<sub>51</sub> I<sub>52</sub> I<sub>53</sub>
R<sub>0</sub> R<sub>1</sub> R<sub>2</sub> ... R<sub>5</sub>
N<sub>0</sub> N<sub>1</sub> N<sub>2</sub> ... N<sub>5</sub>
</pre>

* T: 現在のターン数。1から始まる。
* P: 昼ターンの場合は"D", 夜ターンの場合は"N"。
* I<sub>ij</sub>: 領主iから大名jへの公開されている（つまり昼ターンの情報のみでわかる）親密度。このAIプレイヤ自身は大名0である。
* R<sub>i</sub>: 領主iからこのAIプレイヤへの真の（つまり夜ターンも合わせた）親密度。
* N<sub>i</sub>: 領主iが直前の夜ターンに交渉された回数。

N<sub>0</sub> N<sub>1</sub> N<sub>2</sub> ... N<sub>5</sub>の行は、昼ターンでのみ含まれる。

### 行動の出力形式

そのターンでの交渉相手は、以下のフォーマットで標準出力に出力する。

* __昼ターンの場合__

  <pre>
  L<sub>0</sub> L<sub>1</sub> L<sub>2</sub> L<sub>3</sub> L<sub>4</sub>
  </pre>
  
* __夜ターンの場合__

  <pre>
  L<sub>0</sub> L<sub>1</sub>
  </pre>

L<sub>i</sub>: 交渉相手の領主の番号（0から5で指定）。L<sub>0</sub>からL<sub>4</sub>の順番は関係しない。

一度行動を出力すると、そのAIのターンは終了となる。
なお、ターン開始から1秒以内に出力がなければ、AIプログラムが強制的に停止される。

### 出力時の注意

ゲーム開始時の`READY`やターンの行動を出力する際、最後に改行文字（`"\n"`）を付けること。
また、出力後は標準出力をflushすること。

<a name="PseudoCode"></a>

## 擬似コード

    daimyo = (total_military_strength)
    lord = (military_strength, revealed_intimacy[4], real_intimacy[4])

    main:
        init
        while turn <= 9:
            process_turn
            turn += 1
        finish

    init:
        daimyos = daimyo[4] (0)
        lords = lord[6] (rand(3, 6), [0, 0, 0, 0], [0, 0, 0, 0])
        turn = 1

    process_turn:
        for l in lords:
            display_to_all_daimyo(l.military_strength)
            display_to_all_daimyo(l.revealed_intimacy)
            if is_daytime:
                display_to_all_daimyo(l.negotiation_count)
            l.negotiation_count = 0

        for d in daimyos:
            for i in [1 .. (is_daytime ? 5 : 2)]:
                target = lords[d.selected[i]]
                target.revealed_intimacy[d] += (is_daytime ? 1 : 0)
                target.real_intimacy[d] += (is_daytime ? 1 : 2)
                target.negotiation_count += 1

        if turn == 5:
            for l in lords:
                l.revealed_intimacy = l.real_intimacy

        if turn == 5 or turn == 9:
            calculate_total_military_strength

    is_daytime:
        turn % 2 == 1

    calculate_total_military_strength:
        for l in lords:
            best_daimyos = daimyos.max_by(d -> l.real_intimacy[d])
            for d in best_daimyos:
                d.total_military_strength += l.military_strength / best_daimyos.size

            worst_daimyos = daimyos.min_by(d -> l.real_intimacy[d])
            for d in worst_daimyos:
                d.total_military_strength -= l.military_strength / worst_daimyos.size

    finish:
        winners = daimyos.max_by(d -> d.total_military_strength)
        draw if winners.size > 1
