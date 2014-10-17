var lineCount = 0;
var initialized = false;
var isHoliday = false;
var turn = 0;
var T, P, H, E, L, R, B;

var readline = require('readline'),
rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt("");
console.log('READY');
rl.prompt();
rl.on('line', function (line) {
	lineCount++;

	if(!initialized) {
		if(lineCount == 1) {
			var values = line.split(' ');
			T = values[0], P = values[1], H = values[2];
			E = new Array(H);
		} else if(lineCount == 2) {
			var values = line.split(' ');
			for(var i = 0; i < H; i++) {
				E[i] = values[i];
			}
			initialized = true;
		}
	} else {
		if(lineCount == 1) {

		} else if(2 <= lineCount && lineCount <= 9 ) {
			var values = line.split(' ');
		} else if(lineCount == 10) {
			if(!isHoliday) {
				var values = line.split(' ');
			} else {
				dateHoliday();
				lineCount = 0;
				isHoliday = false;
				turn++;
			}
		} else {
			dateWeekday();
			lineCount = 0;
			isHoliday = true;
			turn++;
		}
	}
	if(turn < 10) {
		rl.prompt();
	} else {
		rl.close();
	}
});

function dateWeekday() {
	var message = ""
	for(var i = 0; i < 4; i++) {
		var num = randomNumber();
		message += num;
		message += ' ';
	}
	message += randomNumber();
	console.log(message);
}

function dateHoliday() {
	var message = ""
	message += randomNumber();
	message += ' ';
	message += randomNumber();
	console.log(message);
}

function randomNumber() {
	return Math.floor(Math.random() * H);
}