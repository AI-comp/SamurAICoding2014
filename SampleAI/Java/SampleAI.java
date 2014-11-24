import java.io.PrintWriter;
import java.util.*;

public class SampleAI {
	private static Random random;
	private static int maxTurn, turn, daimyoNum, lordsNum;
	private static char time;
	private static Lord[] lords;
	private static Scanner scanner;
	private static PrintWriter writer;

	public static void main(String[] args) {
		random = new Random();
		scanner = new Scanner(System.in);
		writer = new PrintWriter(System.out, true);
		writer.println("READY");
		writer.flush();
		readInitialData();
		for (int t = 0; t < maxTurn; t++) {
			readData();
			writeCommand();
		}
		scanner.close();
		writer.close();
	}

	private static void readInitialData() {
		maxTurn = scanner.nextInt();
		daimyoNum = scanner.nextInt();
		lordsNum = scanner.nextInt();
		lords = new Lord[lordsNum];
		for (int i = 0; i < lordsNum; i++) {
			int militaryStrength = scanner.nextInt();
			lords[i] = new Lord(militaryStrength);
		}
	}

	private static void readData() {
		turn = scanner.nextInt();
		time = scanner.next().charAt(0);
		for (int i = 0; i < lordsNum; i++) {
			int[] revealedIntimacy = new int[daimyoNum];
			for (int j = 0; j < daimyoNum; j++) {
				revealedIntimacy[j] = scanner.nextInt();
			}
			lords[i].revealedIntimacy = revealedIntimacy;
		}
		for (int i = 0; i < lordsNum; i++) {
			int realIntimacy = scanner.nextInt();
			lords[i].realIntimacy = realIntimacy;
		}
		if (time == 'D') {
			for (int i = 0; i < lordsNum; i++) {
				int negotiationCount = scanner.nextInt();
				lords[i].negotiationCount = negotiationCount;
			}
		}
	}

	private static void writeCommand() {
		StringBuilder command = new StringBuilder();
		for (int i = 0; i < (time == 'D' ? 5 : 2); i++) {
			int c = random.nextInt(lordsNum);
			command.append(c);
			if (i < 4) {
				command.append(" ");
			}
		}
		writer.println(command.toString());
		writer.flush();
	}
}

class Lord {
	int militaryStrength, revealedIntimacy[], realIntimacy, negotiationCount;

	Lord(int militaryStrength) {
		this.militaryStrength = militaryStrength;
	}
}
