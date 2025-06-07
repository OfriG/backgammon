// 📁 src/logic/ai/evaluate.ts

// Define the player type
type Player = "White" | "Black";

// Define the structure of a board point
interface Point {
  player: Player;
  count: number;
}

// Define the structure of the board used by evaluateBoard
interface Board {
  points: (Point | null)[];
  home: Record<Player, number>;
}

/**
 * Evaluates the board for the given player.
 * Higher score means a better position for the player.
 */
export const evaluateBoard = (board: Board, player: Player): number => {
  let score = 0;

  for (let i = 0; i < board.points.length; i++) {
    const point = board.points[i];

    if (point && point.player === player) {
      const distance = player === "White" ? 23 - i : i;
      score -= distance * point.count;
    } else if (point && point.player !== player && point.count === 1) {
      score += 10; // Reward if opponent is exposed
    }
  }

  score += board.home[player] * 100; // Bonus for pieces in home

  return score;
};
