import sys
import random

class Lord:
	def __init__(self, militaryStrength):
		self.militaryStrength = militaryStrength
		self.revealedIntimacy = []
		self.realIntimacy = 0

def readLine():
	return list(map(int, raw_input().split()))

print('READY')
sys.stdout.flush()

totalTurns, numDaimyo, numLords = readLine()
militaryStrength = readLine()
lords = []
for i in range(numLords):
	lords.append(Lord(militaryStrength[i]))

for t in range(totalTurns):
	turn, time = raw_input().split()
	turn = int(turn)

	for i in range(numLords):
		lords[i].revealedIntimacy = readLine()
	
	realLove = readLine()
	for i in range(numLords):
		lords[i].realIntimacy = realLove[i]
	
	if time == 'D':
		negotiationCount = readLine()
	else:
		negotiationCount = [0] * numLords

	command = []
	for i in range({'D': 5, 'N': 2}[time]):
		command.append(str(random.randrange(numLords)))

	print(' '.join(command))
	sys.stdout.flush()
