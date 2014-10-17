# Lang Wars - JavaChallenge 2014

## Overview of Game

You are a programmer.
Let's propagandize programming languages and increase the number of believers of the programming languages.
Overreach rivals and become the pontiff of programming languages!

## Pseudo Code of Game Rule

If you want to read the game rule in a programming language, please see [pseudo code](#PseudoCode).

## Goal of Game

Get more _victory points_, which are calculated with the number of believers of each programming language, than other players.

## Flow of Game

There are four players and eight programming languages.

Lang Wars is a turn-based game. Players _propagandize_ their favorite programming languages and gather believers.
Because players' actions are partially hidden, it is important to bargain with each other.

Games end in 10 turns, then players gain victory points corresponding to the number of believers of programming languages.
The player who gathered the most number of the believers of a programming language gets the victory points of the language, in contrast, the player who gathered the least number of the believers of a programming language loses the victory points of the language.
Thus, players should propagate their favorite programming languages and gather more believers than the other players, and also, propagate the other programming languages to prevent losing victory points.
The player who gains the most victory points will win!

## Game Start

The game system sets random _attention degree_ (from 3 to 6) to every programming language, and reveals them to players at the beginning.
A language with higher attention degree has more victory points. Players who gathered the most/least number of believers of this language will gain/lose victory points.

## Flow of Turn

There are two types of turns, workday turns and holiday turns.
The first turn is workday. Workday and holiday turns will alternately appear.
In other words, two turns make one week. Odd turns are workday and even turns are holiday.
Players simultaneously select programming languages to propagate.
They select languages to propagate five times in a workday turn, and two times in a holiday turn.
Players select a programming language to propagate one time, will gather one believer of that language.
Players can freely choose which programming languages to propagate.
For example, players can choose five programming languages to propagate each one time, or propagate the same programming language five times in a workday turn.
In addition, players who propagate the same programming language with others, will not influence others to gather believers.

The number of the believers of each programming language will be calculated after all players select propagating languages.
If the turn is workday, which player propagates which programming language is revealed.
If the turn is holiday, only how many times each programming language is propagated is revealed.

The following table indicates the propagation feature in a workday turn and a holiday turn.

|                                                 | Workday | Holiday |
| ----------------------------------------------- | ------- | ------- |
| Propagation times                               | 5       | 2       |
| Number of believers gathered per propagation    | 1       | 1       |
| Revelation of propagation information           | ALL     | For each programming language, the number of propagation times|

## End of Game

After 10 turns, the game ends and victory points are calculated.

The player who gathered the most/least number of the believers of a programming language gains/loses the attention degree of the language as victory points.
When multiple players gathered the most/least number of the believers, they gain/lose the attention degree divided by the number of the players. Floating-point divisions are used in calculating victory points.

After victory points of all the programming languages are calculated, the player who gained the most victory points wins.
When there are multiple players gained the most victory points, the game ends in a draw.

## Input Format of AI Programs

AI programs are executed at the start of the game.
AI programs should print `READY` and the newline character ("\n") to the standard output, and then read the settings of game.
Be sure to flush the standard output after printing.
Then, AI programs read current propagation information of each turn, and print the selected languages.

The thinking time of AI is limited.
If an AI program exceeds the limited thinking time, it will be terminated by force and its behavior will be regarded as "select language 0 always" until the end.

### Output Format of Ready Message

When the AI programs prepared for the game, they must print `READY` and the newline character ("\n") to the standard output.
Be sure to flush the standard output after printing.
Note that, the ready message must be printed within 5 seconds from game start, otherwise the AI program will be terminated by force.

### Input Format of Game Settings

When the game starts (before the 1st turn), the game system sends settings to every AI program through the standard input.
The format of settings is listed as following:

<pre>
T P N
A<sub>0</sub> A<sub>1</sub> A<sub>2</sub> ... A<sub>7</sub>
</pre>

* T: The number of all turns (always 10).
* P: The number of players (always 4).
* N: The number of programming language (always 8).
* A<sub>i</sub>: The attention degree of language i.

### Input Format of Turn Information

At the beginning of each turn, current information is sent through the standard input with the following format:

<pre>
T D
B<sub>00</sub>　B<sub>01</sub> B<sub>02</sub> B<sub>03</sub>
B<sub>10</sub>　B<sub>11</sub> B<sub>12</sub> B<sub>13</sub>
B<sub>20</sub>　B<sub>21</sub> B<sub>22</sub> B<sub>23</sub>
:
:
B<sub>70</sub>　B<sub>71</sub> B<sub>72</sub> B<sub>73</sub>
R<sub>0</sub> R<sub>1</sub> R<sub>2</sub> ... R<sub>7</sub>
P<sub>0</sub> P<sub>1</sub> P<sub>2</sub> ... P<sub>7</sub>
</pre>

* T: Current turn. (starts from 1)
* D: "W" stand for workday turn, "H" stand for holiday turn.
* B<sub>ij</sub>: The visible number (only counting the believers gathered in workday turn) of believers of programming language i gathered by player j. The player 0 is your AI program.
* R<sub>i</sub>: Your real number of believers of programming language i (counting the believers gathered in both workday and holiday turns).
* P<sub>i</sub>: The number of times the programming language i was propagated in the previous holiday turn.

The last line (P<sub>0</sub> P<sub>1</sub> P<sub>2</sub> ... P<sub>7</sub>) is only revealed in workday turns.

### Output format of Actions

Print the language to propagate to the standard output with the following format:

* __Workday Turn__

  <pre>
  L<sub>0</sub> L<sub>1</sub> L<sub>2</sub> L<sub>3</sub> L<sub>4</sub>
  </pre>
  
* __Holiday Turn__

  <pre>
  L<sub>0</sub> L<sub>1</sub>
  </pre>

L<sub>i</sub>: The number of programming language to propagate (from 0 to 7). The order of L<sub>0</sub> to L<sub>4</sub> is not concerned.

Please terminate the output with the newline character ("\n"), and be sure to flush the standard output after printing.
Once an AI program prints its action, its turn finishes.
Note that, if an AI program does not print its action within 1 second from the beginning of a turn, it will be terminated by force.

<a name="PseudoCode"></a>

## Pseudo Code of Game Rule

    programming_language = (attention, revealed_believers[4], real_believers[4])

    main:
        init
        while turn <= 10:
            process_turn
            turn += 1
        finish

    init:
        players = player[4]
        languages = programming_language[8] (rand(3, 6), [0, 0, 0, 0], [0, 0, 0, 0])
        turn = 1

    process_turn:
        for l in languages:
            display_to_all_players(l.attention)
            display_to_all_players(l.revealed_believers)
            if not is_holiday:
                display_to_all_players(l.propagated)
            l.propagated = 0

        for p in players:
            for i in [1 .. (is_holiday ? 2 : 5)]:
                target = languages[p.selected[i]]
                target.revealed_believers[p] += (is_holiday ? 0 : 1)
                target.real_believers[p] += 1
                target.propagated += 1

    is_holiday:
        turn % 2 == 0

    finish:
        for l in languages:
            best_players = players.max_by(p -> l.real_believers[p])
            for p in best_players:
                p.victory_points += h.attention / best_players.size

            worst_players = players.min_by(p -> l.real_believers[p])
            for p in worst_players:
                p.victory_points -= h.attention / worst_players.size

        winners = players.max_by(p -> p.victory_points)
        draw if winners.size > 1
