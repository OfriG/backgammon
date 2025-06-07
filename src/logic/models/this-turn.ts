import Player from "./player";

export default class ThisTurn {
  private _rolledDice: boolean;
  private _maxMoves: number;
  private _movesMade: number;
  public  _dices: number[];
  private _hasDouble: boolean;

 constructor(
  private readonly _turnPlayer: Player,
  private readonly _opponentPlayer: Player,
  dices: number[],
  rolledDice: boolean = false,
  maxMoves: number = 0,
  movesMade: number = 0,
  hasDouble: boolean = false
) {
  this._rolledDice = rolledDice;
  this._movesMade = movesMade;
  this._hasDouble = hasDouble;

  // חשוב: שכפול + השלמה לפי דאבל
  if (rolledDice && dices.length === 2 && dices[0] === dices[1]) {
    this._dices = [dices[0], dices[1], dices[0], dices[1]];
    this._maxMoves = this._dices.reduce((a, b) => a + b, 0);
  } else if (rolledDice && dices.length === 2) {
    this._dices = [...dices];
    this._maxMoves = this._dices.reduce((a, b) => a + b, 0);
  } else {
    this._dices = [...dices];
    this._maxMoves = 0;
  }
}


  public static new = () => new ThisTurn(Player.new(), Player.new(), [], false);

  public get turnPlayer(): Player {
    return this._turnPlayer;
  }

  public get opponentPlayer(): Player {
    return this._opponentPlayer;
  }

  public get rolledDice(): boolean {
    return this._rolledDice;
  }
  public set rolledDice(value: boolean) {
    this._rolledDice = value;
  }

  public get dices(): number[] {
    return this._dices;
  }
  public set dices(value: number[]) {
    this._dices = value;
  }

  public get movesMade(): number {
    return this._movesMade;
  }
  public set movesMade(value: number) {
    this._movesMade = value;
  }

  public get maxMoves(): number {
    return this._maxMoves;
  }
  public set maxMoves(value: number) {
    this._maxMoves = value;
  }

  public get hasDouble(): boolean {
    return this._hasDouble;
  }
  public set hasDouble(value: boolean) {
    this._hasDouble = value;
  }

  public clone(): ThisTurn {
    const newThisTurn = new ThisTurn(
      this._turnPlayer,
      this._opponentPlayer,
      [...this._dices], // Deep copy dices for the clone
      this._rolledDice,
      this._maxMoves,
      this._movesMade,
      this._hasDouble
    );
    return newThisTurn;
  }
}
