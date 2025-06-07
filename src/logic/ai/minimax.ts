// 📁 src/logic/ai/minimax.ts

// Define types for Player, Point, and Board
type Player = "White" | "Black";

interface Point {
  player: Player;
  count: number;
}

interface Board {
  points: (Point | null)[];
  home: Record<Player, number>;
}

interface GameState {
  board: Board;
  dice: number[];
}

// Import your evaluation function
import { evaluateBoard } from "./evaluate";

/**
 * Minimax algorithm with Alpha-Beta pruning.
 * Recursively evaluates the best move for a player.
 */
export function minimax(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean
): number {
  if (depth === 0 || isTerminal(state)) {
    const player: Player = maximizingPlayer ? "White" : "Black";
    return evaluateBoard(state.board, player);
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of getLegalMoves(state, "White")) {
      const newState = applyMove(state, move, "White");
      const evalScore = minimax(newState, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of getLegalMoves(state, "Black")) {
      const newState = applyMove(state, move, "Black");
      const evalScore = minimax(newState, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

/**
 * Checks whether the game has ended.
 */
function isTerminal(state: GameState): boolean {
  return state.board.home["White"] === 15 || state.board.home["Black"] === 15;
}

// Placeholder: should return all legal moves for a given player and state
function getLegalMoves(state: GameState, player: Player): any[] {
  return []; // TODO: Replace with your actual implementation
}

// Placeholder: applies a move and returns the new state
function applyMove(state: GameState, move: any, player: Player): GameState {
  return state; // TODO: Replace with your actual implementation
}
