<?php

	$fp = fopen('php://stdin', 'r');
	
	$maxTurn;
	$numOfDaimyo;
	$numOfLords;
	$turn;
	$time;
	$lords = [];
	
	echo 'READY';
	readGameSetting();
	
	for ($i = 0; $i < $maxTurn; $i++) {
		readData();
		writeCommand();
	}
	
	function readGameSetting() {
		global $fp, $maxTurn, $numOfDaimyo, $numOfLords, $lords;
		$gameSettings = explode(' ', rtrim(fgets($fp)));
		$maxTurn = $gameSettings[0];
		$numOfDaimyo = $gameSettings[1];
		$numOfLords = $gameSettings[2];
	
		$gameSettings = explode(' ', rtrim(fgets($fp)));
		foreach ($gameSettings as $militaryStrength) {
			array_push($lords, new Lord((integer)$militaryStrength));
		}
	}
	
	function readData() {
		global $fp, $turn, $time, $numOfDaimyo, $numOfLords, $lords;
		list($turn, $time) = explode(' ', rtrim(fgets($fp)));
		for ($i = 0; $i < $numOfLords; $i++) {
			$revealedIntimacy = explode(' ', rtrim(fgets($fp)));
		}
		$realIntimacy = explode(' ', rtrim(fgets($fp)));
		for ($i = 0; $i < $numOfLords; $i++) {
			$lords[$i]->setRealIntimacy((integer)$realIntimacy[$i]);
		}
		if ($time === 'D') {
			$negotiationCount = explode(' ', rtrim(fgets($fp)));
			for ($i = 0; $i < $numOfLords; $i++) {
				$lords[$i]->setNegotiationCount((integer)$negotiationCount[$i]);
			}
		}
	}
	
	function writeCommand() {
		global $numOfLords, $turn, $time;
		$command = '';
		if ($time === 'D') {
			for ($i = 0; $i < 5; $i++) {
				$command = $command . mt_rand(0, $numOfLords - 1);
				if($i < 4) {
					$command = $command . ' ';
				}
			}
		} else {
			$command = $command . mt_rand(0, $numOfLords - 1) . ' ' . mt_rand(0, $numOfLords - 1);
		}
		
		$command = $command . PHP_EOL;
		echo $command;
	}

	class Lord {
		private $militaryStrength;
		private $revealedIntimacy;
		private $realIntimacy;
		private $negotiationCount;
		
		function __construct($militaryStrength = 0, $revealedIntimacy = 0, $realIntimacy = 0, $negotiationCount = 0) {
			$this->militaryStrength = $militaryStrength;
			$this->revealedIntimacy = $revealedIntimacy;
			$this->realIntimacy = $realIntimacy;
			$this->negotiationCount = $negotiationCount;
		}
		
		public function getMilitaryStrength() {
			return $this->militaryStrength;
		}
		
		public function setMilitaryStrength($militaryStrength) {
			$this->militaryStrength = $militaryStrength;
		}
		
		public function getRevealedIntimacy() {
			return $this->revealedIntimacy;
		}
		
		public function setRevealedIntimacy($revealedIntimacy) {
			$this->revealedIntimacy = $revealedIntimacy;
		}
		
		public function getRealIntimacy() {
			return $this->realIntimacy;
		}
		
		public function setRealIntimacy($realIntimacy) {
			$this->realIntimacy = $realIntimacy;
		}

		public function getNegotiationCount() {
			return $this->negotiationCount;
		}
		
		public function setNegotiationCount($negotiationCount) {
			$this->negotiationCount = $negotiationCount;
		}
	}
