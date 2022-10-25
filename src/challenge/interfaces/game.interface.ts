import { Player } from "src/player/interfaces/player.interfaces";

export interface Game {
  category?: string;
  challenge?: string;
  players?: Player[];
  def?: Player;
  result?: Result[];
}

export interface Result{
  set: string;
}