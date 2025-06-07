import { toast } from "react-hot-toast";
import { toastStyle } from "../../App";
import { changeTurn } from "../events/change-turn";
import Game from "../models/game";
import ThisTurn from "../models/this-turn";

// 🔁 פונקציה שבודקת אם אין מהלך – ומעבירה תור
export function checkCantMove(game: Game, thisTurn: ThisTurn): ThisTurn {
  if (game.gameOn && !hasPossibleMove(game, thisTurn)) {
    thisTurn = changeTurn(game, thisTurn);
  }
  return thisTurn;
}

// ✅ בודקת אם יש לפחות מהלך אחד חוקי
export function hasPossibleMove(game: Game, thisTurn: ThisTurn): boolean {
  // אם יש חיילים שנאכלו – לבדוק רק כניסה
  if (thisTurn.turnPlayer.outBar.length !== 0) {
    const canGoTo = calcGettingOutOfOutMoves(game, thisTurn);
    return canGoTo.length > 0;
  }

  const containing: number[] = [];
  game.board.forEach((bar, barIdx) => {
    if (bar.includes(thisTurn.turnPlayer.name)) containing.push(barIdx);
  });

  const allMoves: number[] = [];
  for (const barIdx of containing) {
    const canGoTo = calcPossibleMoves(game, barIdx, thisTurn);
    allMoves.push(...canGoTo);
  }

  const endingDiceBars = calcEndingDiceBars(game, thisTurn);
  allMoves.push(...endingDiceBars);

  return allMoves.length > 0;
}

// ✅ מהלכים רגילים לפי הקוביות
export function calcPossibleMoves(
  game: Game,
  fromBarIdx: number,
  thisTurn: ThisTurn
): number[] {
  let [firstDice, secondDice] = thisTurn.dices;
  if (firstDice === null) firstDice = 0;
  if (secondDice === null) secondDice = 0;

  const canGoTo: number[] = [];

  for (let toBarIdx = 0; toBarIdx < game.board.length; toBarIdx++) {
    const toBar = game.board[toBarIdx];

    // חסום אם יש יותר מחייל אחד של היריב
    if (toBar.includes(thisTurn.opponentPlayer.name) && toBar.length > 1) {
      continue;
    }

    // כיוונים לא חוקיים לפי צבע
    if (thisTurn.turnPlayer.name === "White") {
      if (
        (fromBarIdx <= 11 && toBarIdx <= 11 && toBarIdx >= fromBarIdx) ||
        (fromBarIdx > 11 && toBarIdx > 11 && toBarIdx <= fromBarIdx) ||
        (fromBarIdx > 11 && toBarIdx < 11)
      ) continue;
    } else {
      if (
        (fromBarIdx <= 11 && toBarIdx <= 11 && toBarIdx <= fromBarIdx) ||
        (fromBarIdx > 11 && toBarIdx > 11 && toBarIdx >= fromBarIdx) ||
        (fromBarIdx <= 11 && toBarIdx > 11)
      ) continue;
    }

    // חישוב מרחק בין עמדות
    let distance = 0;
    if (fromBarIdx <= 11) {
      distance = toBarIdx <= 11
        ? Math.abs(fromBarIdx - toBarIdx)
        : fromBarIdx + (toBarIdx - 11);
    } else {
      distance = toBarIdx > 11
        ? Math.abs(fromBarIdx - toBarIdx)
        : fromBarIdx + (toBarIdx - 11);
    }

    if (distance === 0 || (distance !== firstDice && distance !== secondDice)) {
      continue;
    }

    canGoTo.push(toBarIdx);
  }

  return canGoTo;
}

// ✅ כניסה מחיילים שנאכלו (bar)
export function calcGettingOutOfOutMoves(
  game: Game,
  thisTurn: ThisTurn
): number[] {
  const opponent = thisTurn.opponentPlayer.name;
  const isWhite = thisTurn.turnPlayer.name === "White";
  const dices = thisTurn.dices;
  const result: number[] = [];

  console.log("=== Checking entry from outBar ===");
  console.log("Player:", thisTurn.turnPlayer.name, "| Dices:", dices);

  for (const die of dices) {
    const barIdx = isWhite ? 24 - die : die - 1;

    if (barIdx < 0 || barIdx >= 24) {
      console.warn(`⛔ Die ${die} → barIdx ${barIdx} out of bounds`);
      continue;
    }

    const point = game.board[barIdx];
    const opponentCount = point.filter(p => p === opponent).length;

    console.log(`🎲 die=${die} → barIdx=${barIdx} → point=[${point.join(",")}] | opponents=${opponentCount}`);

    if (opponentCount <= 1) {
      result.push(barIdx);
    }
  }

  console.log("→ Legal bar entries:", result);
  return result;
}

// ✅ מהלכים אפשריים לשלב סיום
export function calcEndingDiceBars(game: Game, thisTurn: ThisTurn): number[] {
  const turnPlayer = thisTurn.turnPlayer.name;

  function includesPlayer(bar: number) {
    return game.board[bar].includes(turnPlayer);
  }

  const canGoFrom: number[] = [];
  let [firstDice, secondDice] = thisTurn.dices;

  while (firstDice > 0 || secondDice > 0) {
    if (turnPlayer === "White") {
      if (firstDice > 0 && includesPlayer(24 - firstDice)) {
        canGoFrom.push(24 - firstDice);
      }
      if (secondDice > 0 && firstDice !== secondDice && includesPlayer(24 - secondDice)) {
        canGoFrom.push(24 - secondDice);
      }
    } else {
      if (firstDice > 0 && includesPlayer(12 - firstDice)) {
        canGoFrom.push(12 - firstDice);
      }
      if (secondDice > 0 && firstDice !== secondDice && includesPlayer(12 - secondDice)) {
        canGoFrom.push(12 - secondDice);
      }
    }

    firstDice--;
    secondDice--;
  }

  return canGoFrom;
}
