import { IsNotEmpty } from "class-validator";
import { Player } from "src/player/interfaces/player.interfaces";
import { Result } from "../interfaces/game.interface";

export class AssignChallengeToGameDto {
  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  result: Result[];
}