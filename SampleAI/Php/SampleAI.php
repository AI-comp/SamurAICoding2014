<?php

	$fp = fopen('php://stdin', 'r');
	
	$maxTurn;
	$numOfPlayers;
	$numOfHeroines;
	$turn;
	$day;
	$heroines = [];
	
	echo 'READY';
	readGameSetting();
	
	for ($i = 0; $i < $maxTurn; $i++) {
		readData();
		writeCommand();
	}
	
	function readGameSetting() {
		global $fp, $maxTurn, $numOfPlayers, $numOfHeroines, $heroines;
		$gameSettings = explode(' ', rtrim(fgets($fp)));
		$maxTurn = $gameSettings[0];
		$numOfPlayers = $gameSettings[1];
		$numOfHeroines = $gameSettings[2];
	
		$gameSettings = explode(' ', rtrim(fgets($fp)));
		foreach ($gameSettings as $enthusiasm) {
			array_push($heroines, new Heroine((integer)$enthusiasm));
		}
	}
	
	function readData() {
		global $fp, $turn, $day, $numOfPlayers, $numOfHeroines, $heroines;
		list($turn, $day) = explode(' ', rtrim(fgets($fp)));
		for ($i = 0; $i < $numOfHeroines; $i++) {
			$revealedScores = explode(' ', rtrim(fgets($fp)));
		}
		$realScores = explode(' ', rtrim(fgets($fp)));
		for ($i = 0; $i < $numOfHeroines; $i++) {
			$heroines[$i]->setRealScore((integer)$realScores[$i]);
		}
		if ($day === 'W') {
			$dated = explode(' ', rtrim(fgets($fp)));
			for ($i = 0; $i < $numOfHeroines; $i++) {
				$heroines[$i]->setDated((integer)$dated[$i]);
			}
		}
	}
	
	function writeCommand() {
		global $numOfHeroines, $turn, $day;
		$command = '';
		if ($day === 'W') {
			for ($i = 0; $i < 5; $i++) {
				$command = $command . mt_rand(0, $numOfHeroines - 1);
				if($i < 4) {
					$command = $command . ' ';
				}
			}
		} else {
			$command = $command . mt_rand(0, $numOfHeroines - 1) . ' ' . mt_rand(0, $numOfHeroines - 1);
		}
		
		$command = $command . PHP_EOL;
		echo $command;
	}

	class Heroine {
		private $enthusiasm;
		private $revealedScore;
		private $realScore;
		private $dated;
		
		function __construct($enthusiasm = 0, $revealedScore = 0, $realScore = 0, $dated = 0) {
			$this->enthusiasm = $enthusiasm;
			$this->revealedScore = $revealedScore;
			$this->realScore = $realScore;
			$this->dated = $dated;
		}
		
		public function getEnthusiasm() {
			return $this->enthusiasm;
		}
		
		public function setEnthusiasm($enthusiasm) {
			$this->enthusiasm = $enthusiasm;
		}
		
		public function getRevealedScore() {
			return $this->revealedScore;
		}
		
		public function setRevealedScore($revealedScore) {
			$this->revealedScore = $revealedScore;
		}
		
		public function getRealScore() {
			return $this->realScore;
		}
		
		public function setRealScore($realScore) {
			$this->realScore = $realScore;
		}

		public function getDated() {
			return $this->dated;
		}
		
		public function setDated($dated) {
			$this->dated = $dated;
		}
	}
