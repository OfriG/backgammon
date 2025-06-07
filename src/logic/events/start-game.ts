import { toast } from "react-hot-toast";
import { toastStyle } from "../../App";
import { dice } from "./roll-dice";
import Game from "../models/game";
import ThisTurn from "../models/this-turn";

export function startingGame(game: Game): ThisTurn {
  const thisTurn = new ThisTurn(game.whitePlayer, game.blackPlayer, [], false);
  toast.success("Game starts with ⚪ WHITE ⚪", toastStyle(thisTurn));
  return thisTurn;
}


