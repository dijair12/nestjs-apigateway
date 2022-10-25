import { PartialType } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { CreateChallengeDto } from "./create-challenge.dto";
export class UpdateChallengeDto extends PartialType(CreateChallengeDto){
  @IsOptional()
  status: string
}
