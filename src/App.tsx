import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import "./App.css";
import { startingGame } from "./logic/events/start-game";
import { rollingDice } from "./logic/events/roll-dice";
import { selecting } from "./logic/events/select";
import BoardBottom from "./frontend/BoardBottom";
import ThisTurn from "./logic/models/this-turn";
import Game from "./logic/models/game";
import ThisMove from "./logic/models/this-move";
import BoardTop from "./frontend/BoardTop";
import { checkCantMove } from "./logic/calculations/calc-possible-moves";
import { getBestMove } from "./logic/agents/smart-agent";
import { changingTurn } from "./logic/events/change-turn";

export const toastStyle = (thisTurn: ThisTurn) => {
  return {
    style: {
      borderRadius: "10px",
      background: thisTurn.turnPlayer.name,
      color: thisTurn.opponentPlayer.name,
      border:
        thisTurn.turnPlayer.name === "White"
          ? "2px solid black"
          : "2px solid white",
    },
  };
};

function App() {
  const [game, setGame] = useState(Game.new);
  const [thisTurn, setThisTurn] = useState(ThisTurn.new);
  const [thisMove, setThisMove] = useState(ThisMove.new);

  useEffect(() => {
    if (!game.gameOn || !thisTurn.turnPlayer.isBlack || thisTurn.rolledDice) return;

    console.log('AI TURN START', { thisTurn });
    let tempTurn = rollingDice(thisTurn.clone());
    console.log('AI rolled dice:', tempTurn.dices);
    let tempGame = game;
    let tempMove = new ThisMove();
    let movesMade = false;

    setTimeout(() => {
      // לולאה: כל עוד יש מהלך חוקי והקוביות לא נוצלו
      let loopCount = 0;
      const maxLoop = 20;
      while (true) {
        const checkedTurn = checkCantMove(tempGame, tempTurn);
        const bestMove = getBestMove(tempGame, checkedTurn, 2);
        console.log('AI bestMove:', bestMove);
        if (bestMove) {
          // בצע מהלך
          let result = selecting(bestMove.from, tempGame, checkedTurn, tempMove);
          [tempGame, tempTurn, tempMove] = result;
          result = selecting(bestMove.to, tempGame, tempTurn, tempMove);
          [tempGame, tempTurn, tempMove] = result;
          movesMade = true;
        } else {
          break;
        }
        // עצור אם נגמרו הקוביות
        if (!tempTurn.dices || tempTurn.dices.length === 0 || tempTurn.maxMoves === 0) break;
        loopCount++;
        if (loopCount > maxLoop) {
          console.warn('AI move loop exceeded maxLoop, breaking to prevent crash');
          break;
        }
      }
      if (movesMade) {
        // ודא שהתור עובר לשחקן הבא, rolledDice=false
        const nextTurn = changingTurn(tempTurn);
        nextTurn.rolledDice = false;
        nextTurn.maxMoves = 0;
        setGame(tempGame);
        setThisTurn(nextTurn);
        setThisMove(ThisMove.new());
      } else {
        // אין מהלך – סיים תור (בלי toast)
        const skippedTurn = changingTurn(tempTurn);
        setThisTurn(skippedTurn);
      }
    }, 500);
  }, [thisTurn, game]);

  function startGame() {
    const tempGame = Game.new();
    tempGame.gameOn = true;
    setGame(tempGame);

    const tempThisTurn = startingGame(game.clone());
    setThisTurn(tempThisTurn);

    const tempThisMove = ThisMove.new();
    setThisMove(tempThisMove);
  }

  function rollDice() {
    if (thisTurn.rolledDice) {
      toast.error(
        `Play your move first
          ${thisTurn.turnPlayer.icon} 🎲 ${thisTurn.dices} 🎲`,
        toastStyle(thisTurn)
      );
      return;
    }

    let returnedThisTurn = rollingDice(thisTurn.clone());

    if (returnedThisTurn.rolledDice)
      returnedThisTurn = checkCantMove(game, returnedThisTurn.clone());

    setThisTurn(returnedThisTurn);
    console.log('setThisTurn (rollDice):', returnedThisTurn);
  }

  function select(index: number | string) {
    console.log('selecting called', { index, thisTurn, thisMove });
    const [returnedGame, returnedThisTurn, returnedThisMove] = selecting(
      index,
      game.clone(),
      thisTurn.clone(),
      thisMove.clone()
    );

    setGame(returnedGame);
    setThisTurn(returnedThisTurn);
    setThisMove(returnedThisMove);
    console.log('setThisTurn (select):', returnedThisTurn);
    console.log('setThisMove (select):', returnedThisMove);
  }

  return (
    <>
      <BoardTop game={game} thisMove={thisMove} select={select} />

      <BoardBottom
        game={game}
        thisMove={thisMove}
        rollDice={rollDice}
        startGame={startGame}
        select={select}
      />
    </>
  );
}

export default App;
