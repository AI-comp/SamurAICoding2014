import java.io.PrintWriter;
import java.util.*;

public class SampleAI {
	private static Random random;
	private static int maxTurn, turn, playersNum, languagesNum;
	private static char day;
	private static Language[] languages;
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
		playersNum = scanner.nextInt();
		languagesNum = scanner.nextInt();
		languages = new Language[languagesNum];
		for (int i = 0; i < languagesNum; i++) {
			int attention = scanner.nextInt();
			languages[i] = new Language(attention);
		}
	}

	private static void readData() {
		turn = scanner.nextInt();
		day = scanner.next().charAt(0);
		for (int i = 0; i < languagesNum; i++) {
			int[] revealedScore = new int[playersNum];
			for (int j = 0; j < playersNum; j++) {
				revealedScore[j] = scanner.nextInt();
			}
			languages[i].revealedScore = revealedScore;
		}
		for (int i = 0; i < languagesNum; i++) {
			int realScore = scanner.nextInt();
			languages[i].realScore = realScore;
		}
		if (day == 'W') {
			for (int i = 0; i < languagesNum; i++) {
				int selectedTimes = scanner.nextInt();
				languages[i].selectedTimes = selectedTimes;
			}
		}
	}

	private static void writeCommand() {
		StringBuilder command = new StringBuilder();
		for (int i = 0; i < (day == 'W' ? 5 : 2); i++) {
			int c = random.nextInt(languagesNum);
			command.append(c);
			if (i < 4) {
				command.append(" ");
			}
		}
		writer.println(command.toString());
		writer.flush();
	}
}

class Language {
	int attention, revealedScore[], realScore, selectedTimes;

	Language(int attention) {
		this.attention = attention;
	}
}
