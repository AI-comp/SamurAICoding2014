# Negotiate and Conquer: SamurAI Coding 2014 Game Rule

## Outline

You are a daimyo (a feudal lord) of the Civil War Era.
Negotiate with noncommittal feudal lords to ally themselves with you and win a victory.

## Game Objective

The objective of the game is to acquire _military force_ by increasing the _intimacy degree_ of noncommittal _lords_ through _negotiation_ and to be the one with the largest _total military strength_ among all _daimyo_.
Each daimyo gains military strength at the middle and the end of the game.
Each of the lords supports the daimyo with the highest intimacy degree at battles, increasing the total military strength of that daimyo by the lord's _force strength_, while opposing one with the lowest intimacy, decreasing its total military strength with the same amount.

## Game Process

Game manager [pseudo code](#PseudoCode) is provided below.

### Initial Setting

There are 4 daimyo and 6 lords.
Each player controls one daimyo.
The total military strength of each daimyo is initially 0.
Each lord is neutral and their intimacy degree with their intimacy degrees with all the daimyo are 0.
The military force of each of the lords is set randomly among 3, 4, 5, or 6, and made open.

### Game Turns and Negotiations

One game consists of 9 turns: alternatingly held 5 _daytime turns_ and 4 _nighttime turns_.
The first turn is a daytime turn.

On each turn, each of the daimyo chooses one or more lords to have negotiation with.
Five times of negotiation are made on a daytime turn, and two times on a nighttime turn.
A daimyo can have negotiation with the same lord for more than once on a single turn.
In daytime turns, the intimacy degree of a lord with a daimyo is increased by the number of times the daimyo had negotiation with the lord.
In nighttime turns, it is increased by twice the number of times the daimyo had negotiation with the lord.
Intimacy degree is increased each time, and will never be decreased.

After each of the daytime turns, all the information are made open: which daimyo had negotiation with which lord and how many times.
After each of the nighttime turns, the number of times each of the lords had negotiation is made open, but which of the daimyo had negotiation is kept secret.

At the end of the fifth turn (the third daytime turn), the so-far-concealed information on which daimyo had negotation with which lords on two preceding nighttime turns are made open.

### Calculation of Total Military Strength

At the end of the fifth turn and the ninth (final) turn, lords take action to change the total military strength of each daimyo.
Each lord supports the daimyo with the largest initimacy degree, increasing the daimyo's total military strength by the lord's force strengths, and opposes the daimyo with the smallest initimacy degree, decreasing the daimyo's total military strength by the lord's force strengths.
When there are more than one daimyo with the highest or the lowest intimacy degree with a lord, the military strength of the lord divided by the number of such daimyo is added to or subtracted from the military strengths of the relevant daimyo.
The total strength of a daimyo can take negative values.
The military strength acquired at the end of the fifth turn is kept and the military strength acquired at the end of the the ninth turn is added to it.

## Game Result

After all the nine turns, the daimyo with the largest total military strength wins the game.
The game is a draw when there are more than one daimyo with the largest total military strength.

## Input and Output Format of an AI Program

Your AI program is executed at the start of the game.
When it becomes ready to start a game, print `READY` to the standard output, and then read the settings of the game.
Then read current information each turn and outputs lords to negotiate with in that turn.

The thinking time of an AI program is limited.
If an AI program exceeds the limit, it will be terminated and its actions will be always regarded as "negotiate with the 0th lord" in the rest of the game.

### Output Format of a Ready Message

When your AI becomes ready to start a game, print `READY` to the standard output.
If a ready message is not printed within 5 seconds, the AI program will be terminated.

### Input Format of Game Settings

When the game starts, namely at the beginning of the first turn, game settings are sent through the standard input with the following format:

<pre>
T D L
M<sub>0</sub> M<sub>1</sub> M<sub>2</sub> ... M<sub>5</sub>
</pre>

* T: The number of turns.
* D: The number of daimyo.
* L: The number of lords.
* M<sub>i</sub>: The military strength of the i-th lord.

### Input Format of Turn Information

At the beginning of each turn, current information is sent through the standard input with the following format:

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

* T: Current turn. Starts from 1.
* P: "D" in a daytime turn, "N" in a nighttime turn.
* I<sub>ij</sub>: The visible intimacy degree (only counting one increased in daytime turns) of the i-th lord to the j-th daimyo. Your AI player is the 0th daimyo. In the sixth turn and later turns, this number includes intimacy degree increased in nighttime turns before the fifth turn.
* R<sub>i</sub>: The real intimacy degree (counting one increased in both daytime turns and nighttime turns) of the i-th lord to your AI player.
* N<sub>i</sub>: The number of times the i-th lords has been negotiated with in the previous nighttime turn.

The last line R<sub>0</sub> R<sub>1</sub> R<sub>2</sub> ... R<sub>5</sub> appears only in daytime turns.

### Output Format of Actions

Print lords to negotiate with in that turn to the standard output with the following format:

* __Daytime Turn__

  <pre>
  L<sub>0</sub> L<sub>1</sub> L<sub>2</sub> L<sub>3</sub> L<sub>4</sub>
  </pre>

* __Nighttime Turn__

  <pre>
  L<sub>0</sub> L<sub>1</sub>
  </pre>

L<sub>i</sub>: The index of a lord to negotiate with (from 0 to 5). The order of L<sub>0</sub> to L<sub>4</sub> does not matter.

Once your AI program prints its actions, its turn finishes.
If your AI program does not print its action within 1 second from the beginning of the turn, it will be terminated.

### Notice

When you output `READY` at the start of the game or actions in each turn, be sure to output a newline character (`"\n"`) at the end of the line and flush the standard output after printing.

<a name="PseudoCode"></a>

## Pseudo Code

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
