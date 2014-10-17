import scala.util.Random
import scala.util.control.Breaks.{break, breakable}
import scala.collection.mutable.ListBuffer

import java.io.InputStreamReader
import java.io.FileInputStream

object SampleAI {

	var allTurn = 0
	var numPlayer = 0
	var numHeroine = 0

	var turn = 0
	var day = 'W'
	var strategy = ListBuffer[Int]()
	var heroines = List.empty[Heroine]
	var real = List.empty[Int]
	var dated = List.empty[Boolean]

	def main(args: Array[String]): Unit = {
		println("READY")

		var buf = Console.readLine.split(" ")
		allTurn = buf(0).toInt
		numPlayer = buf(1).toInt
		numHeroine = buf(2).toInt

		Console.readLine.split(" ").foreach(f => heroines = new Heroine(f.toInt)::heroines)
		heroines = heroines.reverse

		breakable{
			while (true){
				buf = Console.readLine.split(" ")
				turn = buf(0).toInt
				day = buf(1).head
				if (turn == -1){
					break
				}
				readIn
				think
				writeOut
			}
		}
	}

	def readIn(): Unit = {
		heroines.foreach(h => {
			var values = List.empty[Int]
			Console.readLine.split(" ").foreach(v => values = v.toInt::values)
			values = values.reverse
			h.updateValues(values)
			
			//h.revealSelf
		})
		Console.readLine.split(" ").foreach(v => real = v.toInt::real)
		real = real.reverse
		if (day == 'W'){
			Console.readLine.split(" ").foreach(v => dated = v.toInt::dated)
			dated = dated.reverse
		}
	}

	def writeOut(): Unit = {
		println(strategy.mkString(" "))
	}

	def think(): Unit = {
		strategy.clear
		val num = if (day == 'W') 5 else 2
		for (i <- 0 until num)
			strategy += Random.nextInt(numHeroine)
	}
	
	class Heroine(p: Int){
		val property = p
		var values = List.empty[Int]
		
		def updateValues(vs: List[Int]): Unit = {
			values = vs
		}
		
		def revealSelf(): Unit = {
			values.foreach(v => print(v + " "))
			println("")
		}
	}
}
