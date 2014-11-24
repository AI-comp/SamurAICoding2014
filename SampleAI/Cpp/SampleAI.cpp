#include <iostream>
#include <vector>
#include <stdlib.h>
using namespace std;

struct Lord {
	int militaryStrength;
	vector<int> revealedIntimacy;
	int realIntimacy, negotiationCount;
};
int numTurns, turn, numDaimyo, numLords;
vector<Lord> lord;
char timePeriod;

void readInitialData() {
	cin >> numTurns >> numDaimyo >> numLords;
	for (int i = 0; i < numLords; i++) {
		Lord l;
		cin >> l.militaryStrength;
		lord.push_back(l);
	}
}

void readData() {
	cin >> turn >> timePeriod;
	for (int i = 0; i < numLords; i++) {
		vector<int> intimacy;
		for (int j = 0; j < numDaimyo; j++) {
			int in;
			cin >> in;
			intimacy.push_back(in);
		}
		lord[i].revealedIntimacy = intimacy;
	}
	for (int i = 0; i < numLords; i++) {
		cin >> lord[i].realIntimacy;
	}
	if (timePeriod == 'D') {
		for (int i = 0; i < numLords; i++) {
			int n;
			cin >> n;
			lord[i].negotiationCount = n;
		}
	}
}

void writeCommand() {
	if (timePeriod == 'D') {
		for (int i = 0; i < 5; i++) {
			cout << rand() % numLords;
			if (i < 4) {
				cout << " ";
			} else {
				cout << endl;
			}
		}
	} else {
		for (int i = 0; i < 2; i++) {
			cout << rand() % numLords;
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
	for (int i = 0; i < numTurns; i++) {
		readData();
		writeCommand();
	}
}
