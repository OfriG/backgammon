import Game from "../models/game";
import ThisTurn from "../models/this-turn";
import { calcPossibleMoves } from "../calculations/calc-possible-moves";
import { evaluateBoard } from "../ai/evaluate";
import PlayerClass from "../models/player";

type Player = "White" | "Black";

interface SimulatedBoard {
  points: (null | { player: Player; count: number })[];
  home: Record<Player, number>;
}

export function getBestMove(game: Game, thisTurn: ThisTurn, depth: number): { from: number, to: number } | null {
  console.log('AI turn:', thisTurn);
  console.log('AI dices:', thisTurn.dices);
  let bestMove: { from: number, to: number } | null = null;
  let bestScore = -Infinity;

  for (let i = 0; i < game.board.length; i++) {
    const bar = game.board[i];
    if (bar.includes("Black")) {
      const possibleMoves = calcPossibleMoves(game, i, thisTurn);
      console.log('Checking moves for bar', i, 'possible:', possibleMoves);
      for (const move of possibleMoves) {
        const simulated = simulateMove(game.board, i, move);
        const score = minimax(simulated, depth - 1, -Infinity, Infinity, false, "Black");
        if (score > bestScore) {
          bestScore = score;
          bestMove = { from: i, to: move };
        }
      }
    }
  }

  if (bestMove === null) {
    console.log("AI found no valid moves!", game, thisTurn);
  }

  return bestMove;
}

function minimax(
  board: SimulatedBoard,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  player: Player
): number {
  if (depth === 0) {
    return evaluateBoard(board, player);
  }

  const currentPlayer = maximizingPlayer ? player : player === "Black" ? "White" : "Black";
  let bestScore = maximizingPlayer ? -Infinity : Infinity;

  for (let i = 0; i < board.points.length; i++) {
    const point = board.points[i];
    if (point && point.player === currentPlayer) {
      const dummyGame = { board: board.points.map(p =>
        p ? Array(p.count).fill(p.player) : []
      ) } as Game;
      const dummyTurn = {
        turnPlayer: new PlayerClass(
          currentPlayer,
          currentPlayer === "White" ? "⚪ WHITE ⚪" : "⚫ BLACK ⚫",
          currentPlayer === "White" ? "WhiteOutBar" : "BlackOutBar",
          currentPlayer === "White" ? "WhiteEndBar" : "BlackEndBar",
          currentPlayer,
          currentPlayer === "White" ? "1px solid black" : "1px solid #e9e2d6"
        ),
        opponentPlayer: new PlayerClass(
          currentPlayer === "White" ? "Black" : "White",
          currentPlayer === "White" ? "⚫ BLACK ⚫" : "⚪ WHITE ⚪",
          currentPlayer === "White" ? "BlackOutBar" : "WhiteOutBar",
          currentPlayer === "White" ? "BlackEndBar" : "WhiteEndBar",
          currentPlayer === "White" ? "Black" : "White",
          currentPlayer === "White" ? "1px solid #e9e2d6" : "1px solid black"
        ),
        dices: [1, 2]
      } as ThisTurn;

      const possibleMoves = calcPossibleMoves(dummyGame, i, dummyTurn);
      for (const move of possibleMoves) {
        const simulated = simulateMove(dummyGame.board, i, move);
        const evalScore = minimax(simulated, depth - 1, alpha, beta, !maximizingPlayer, player);

        if (maximizingPlayer) {
          bestScore = Math.max(bestScore, evalScore);
          alpha = Math.max(alpha, bestScore);
        } else {
          bestScore = Math.min(bestScore, evalScore);
          beta = Math.min(beta, bestScore);
        }

        if (beta <= alpha) {
          break;
        }
      }
    }
  }

  return bestScore;
}

function simulateMove(board: string[][], from: number, to: number): SimulatedBoard {
  const newBoard = board.map(bar => [...bar]);
  const piece = newBoard[from].pop();
  if (piece) {
    newBoard[to].push(piece);
  }

  return {
    points: newBoard.map(bar =>
      bar.length > 0 ? { player: bar[0] as Player, count: bar.length } : null
    ),
    home: { White: 0, Black: 0 }
  };
}