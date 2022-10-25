import { ArrayMaxSize, ArrayMinSize, IsDateString, IsNotEmpty } from "class-validator";
import { Player } from "src/player/interfaces/player.interfaces";

export class CreateChallengeDto {
  @IsNotEmpty()
  @IsDateString()
  dateTimeChallenge: Date;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  request: Player;

  @IsNotEmpty()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  players: Player[];
}