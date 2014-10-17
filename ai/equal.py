import sys
import random
import ailib

class AI(ailib.AI):
	def chooseCommands(self):
		state = self.states[-1]
		commands = []

		targetValue = 45 / self.numHeroines
		if state.day == 'W':
			dateCount = 5
		else:
			dateCount = 2
		for i in range(self.numHeroines):
			for j in range(int(targetValue - {'W': 0, 'H': 1}[state.day] - state.heroines[i].myRealLove)):
				commands.append(i)
			if len(commands) >= dateCount:
				break
		while len(commands) < dateCount:
			commands.append(random.randrange(self.numHeroines))

		return commands

if __name__ == "__main__":
	ai = AI()
	ai.run()
