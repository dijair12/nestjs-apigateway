import { Player } from "src/player/interfaces/player.interfaces";
import { ChallengeStatus } from "../challenge-status.enum";
import { Game } from "./game.interface";

export interface Challenge {
  dateTimeChallenge: string;
  status: ChallengeStatus;
  dateTimeRequest: string;
  dateTimeAnswer: string;
  request: Player;
  category: string;
  players: Player[];  
  game: Game;
}