import sys
import random

class Heroine:
	def __init__(self, index, enthusiasm):
		self.index = index
		self.enthusiasm = enthusiasm
		self.revealedLove = []
		self.myRealLove = 0
		self.dated = False

class State:
	def __init__(self, turn, day, heroines):
		self.turn = turn
		self.day = day
		self.heroines = heroines

class AI:
	def __init__(self):
		self.states = []
	
	def readLine():
		return list(map(int, input().split()))
		
	def getDay(turn):
		return ['H', 'W'][turn % 2]

	def getNumRequiredCommands(day):
		return {'W': 5, 'H': 2}[day]
		
	def getLoveIncrement(day):
		return {'W': 2, 'H': 2}[day]

	def run(self):
		print('READY')
		sys.stdout.flush()

		self.readInitialInformation()
		for turn in range(self.totalTurns):
			self.processTurn()
		
	def readInitialInformation(self):
		self.totalTurns, self.numPlayers, self.numHeroines = AI.readLine()
		self.enthusiasm = AI.readLine()

	def readTurnInformation(self):
		turn, day = input().split()
		turn = int(turn)

		heroines = []
		for i in range(self.numHeroines):
			heroines.append(Heroine(i, self.enthusiasm[i]))
			heroines[i].revealedLove = AI.readLine()
		
		realLove = AI.readLine()
		for i in range(self.numHeroines):
			heroines[i].myRealLove = realLove[i]

		if day == 'W':
			dated = list(map(bool, AI.readLine()))
			for i in range(self.numHeroines):
				heroines[i].dated = dated[i]
			
		self.states.append(self.createState(turn, day, heroines))

	def processTurn(self):
		self.readTurnInformation()
		print(" ".join(map(str, self.chooseCommands())))
		sys.stdout.flush()
		
	def chooseCommands(self):
		return []
		
	def createState(self, turn, day, heroines):
		return State(turn, day, heroines)