import java.io.PrintWriter;
import java.util.*;

public class SampleAI {
	private static Random random;
	private static int maxTurn, turn, playersNum, heroinesNum;
	private static char day;
	private static Heroine[] heroines;
	private static final Scanner scanner = new Scanner(System.in);
	private static final PrintWriter writer = new PrintWriter(System.out, true);

	public static void main(String[] args) {
		if (args.length > 0) {
			try {
				Long seed = Long.parseLong(args[0]);
				writer.println("SEED: " + seed);
				random = new Random(seed);
			} catch (Exception e) {
			}
		}
		if (random == null) {
			random = new Random();
		}

		writer.println("READY");
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
		playersNum = scanner.nextInt();
		heroinesNum = scanner.nextInt();
		heroines = new Heroine[heroinesNum];
		for (int i = 0; i < heroinesNum; i++) {
			int enthusiasm = scanner.nextInt();
			heroines[i] = new Heroine(enthusiasm);
		}
	}

	private static void readData() {
		turn = scanner.nextInt();
		day = scanner.next().charAt(0);
		for (int i = 0; i < heroinesNum; i++) {
			int[] revealedScore = new int[playersNum];
			for (int j = 0; j < playersNum; j++) {
				revealedScore[j] = scanner.nextInt();
			}
			heroines[i].revealedScore = revealedScore;
		}
		for (int i = 0; i < heroinesNum; i++) {
			int realScore = scanner.nextInt();
			heroines[i].realScore = realScore;
		}
		if (day == 'W') {
			for (int i = 0; i < heroinesNum; i++) {
				int datedTimes = scanner.nextInt();
				heroines[i].datedTimes = datedTimes;
			}
		}
	}

	private static void writeCommand() {
		StringBuilder command = new StringBuilder();
		for (int i = 0; i < (day == 'W' ? 5 : 2); i++) {
			int c = random.nextInt(heroinesNum);
			command.append(c);
			if (i < 4) {
				command.append(" ");
			}
		}
		writer.println(command.toString());
	}
}

class Heroine {
	int enthusiasm, revealedScore[], realScore, datedTimes;

	Heroine(int enthusiasm) {
		this.enthusiasm = enthusiasm;
	}
}
