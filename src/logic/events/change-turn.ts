// 📁 src/logic/events/change-turn.ts

import { toast } from "react-hot-toast";
import { toastStyle } from "../../App";
import Game from "../models/game";
import ThisTurn from "../models/this-turn";
import ThisMove from "../models/this-move";
import { getBestMove } from "../agents/smart-agent";
import { selecting } from "./select";
import AIPlayer from "../models/ai-player";
import { movingPiece } from "./moving";
import { dice } from "./roll-dice";

/**
 * Handles switching turns and activating AI if needed.
 */
export function changeTurn(game: Game, thisTurn: ThisTurn): ThisTurn {
  // Switch the current and opponent players
  thisTurn = changingTurn(thisTurn);

  return thisTurn;
}

/**
 * Actually switches the turn between players.
 */
export function changingTurn(oldTurn: ThisTurn): ThisTurn {
  if (
    oldTurn.dices.length === 0 &&
    oldTurn.maxMoves === 0 &&
    oldTurn.dices.length >= 2 &&
    oldTurn.dices[0] === oldTurn.dices[1] &&
    !oldTurn.hasDouble
  ) {
    const rolledAgainTurn = new ThisTurn(
      oldTurn.turnPlayer,
      oldTurn.opponentPlayer,
      dice(), // זריקה מחדש
      true,
      0,
      0,
      true // מסמן שקיבל תור כפול
    );

    const message = `Double turn! ${rolledAgainTurn.turnPlayer.icon} rolls again 🎲 ${rolledAgainTurn.dices}`;
    toast.success(message, toastStyle(rolledAgainTurn));
    return rolledAgainTurn;
  }

  // 🔄 אחרת – מעבר תור רגיל
  const thisTurn = new ThisTurn(
    oldTurn.opponentPlayer,
    oldTurn.turnPlayer,
    [],
    false,
    0,
    0,
    false
  );

  const message = `Turn is now ${thisTurn.turnPlayer.icon}`;
  toast.success(message, toastStyle(thisTurn));

  return thisTurn;
}
