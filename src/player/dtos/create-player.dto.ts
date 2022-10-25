import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  urlPhotoPlayer: string;
}