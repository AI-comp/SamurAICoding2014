import scala.util.Random
import scala.util.control.Breaks.{break, breakable}
import scala.collection.mutable.ListBuffer

import java.io.InputStreamReader
import java.io.FileInputStream

object SampleAI {

	var allTurn = 0
	var numDaimyo = 0
	var numLord = 0

	var turn = 0
	var time = 'D'
	var strategy = ListBuffer[Int]()
	var lords = List.empty[Lord]
	var real = List.empty[Int]
	var negotiationCount = List.empty[Int]

	def main(args: Array[String]): Unit = {
		println("READY")

		var buf = Console.readLine.split(" ")
		allTurn = buf(0).toInt
		numDaimyo = buf(1).toInt
		numLord = buf(2).toInt

		Console.readLine.split(" ").foreach(f => lords = new Lord(f.toInt)::lords)
		lords = lords.reverse

		breakable{
			while (true){
				buf = Console.readLine.split(" ")
				turn = buf(0).toInt
				time = buf(1).head
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
		lords.foreach(l => {
			var values = List.empty[Int]
			Console.readLine.split(" ").foreach(v => values = v.toInt::values)
			values = values.reverse
			l.updateValues(values)
			
			//l.revealSelf
		})
		Console.readLine.split(" ").foreach(v => real = v.toInt::real)
		real = real.reverse
		if (time == 'D'){
			Console.readLine.split(" ").foreach(v => negotiationCount = v.toInt::negotiationCount)
			negotiationCount = negotiationCount.reverse
		}
	}

	def writeOut(): Unit = {
		println(strategy.mkString(" "))
	}

	def think(): Unit = {
		strategy.clear
		val num = if (time == 'D') 5 else 2
		for (i <- 0 until num)
			strategy += Random.nextInt(numLord)
	}
	
	class Lord(p: Int){
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
