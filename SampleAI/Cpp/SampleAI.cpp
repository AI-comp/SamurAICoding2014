#include <iostream>
#include <vector>
#include <stdlib.h>
using namespace std;

struct Heroine {
	int enthusiasm;
	vector<int> revealedScore;
	int realScore, datedTimes;
};
int MaxTurn, Turn, PlayersNum, HeroinesNum;
vector<Heroine> Heroines;
char Day;

void readInitialData() {
	cin >> MaxTurn >> PlayersNum >> HeroinesNum;
	for (int i = 0; i < HeroinesNum; i++) {
		Heroine h;
		cin >> h.enthusiasm;
		Heroines.push_back(h);
	}
}

void readData() {
	cin >> Turn >> Day;
	for (int i = 0; i < HeroinesNum; i++) {
		vector<int> rScores;
		for (int j = 0; j < PlayersNum; j++) {
			int rs;
			cin >> rs;
			rScores.push_back(rs);
		}
		Heroines[i].revealedScore = rScores;
	}
	for (int i = 0; i < HeroinesNum; i++) {
		cin >> Heroines[i].realScore;
	}
	if (Day == 'W') {
		for (int i = 0; i < HeroinesNum; i++) {
			int d;
			cin >> d;
			Heroines[i].datedTimes = d;
		}
	}
}

void writeCommand() {
	if (Day == 'W') {
		for (int i = 0; i < 5; i++) {
			cout << rand() % HeroinesNum;
			if (i < 4) {
				cout << " ";
			} else {
				cout << endl;
			}
		}
	} else {
		for (int i = 0; i < 2; i++) {
			cout << rand() % HeroinesNum;
			if (i < 1) {
				cout << " ";
			} else {
				cout << endl;
			}
		}
	}
}

int main() {
	cout << "READY" << endl;
	readInitialData();
	for (int i = 0; i < MaxTurn; i++) {
		readData();
		writeCommand();
	}
}
