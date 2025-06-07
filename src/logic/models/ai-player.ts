import Player from "./player";

export default class AIPlayer extends Player {
  constructor() {
    super(
      "Black",
      "⚫ BLACK ⚫",
      "BlackOutBar",
      "BlackEndBar",
      "Black",
      "1px solid #e9e2d6"
    );
  }

  public override clone(): AIPlayer {
    const newPlayer = new AIPlayer();
    newPlayer.outBar = [...this.outBar];
    newPlayer.endBar = [...this.endBar];
    newPlayer.inTheEnd = this.inTheEnd;
    return newPlayer;
  }

  public get isBlack() {
    return true;
  }
}
