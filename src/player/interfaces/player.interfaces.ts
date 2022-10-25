export interface Player extends Document {
  _id?: string | any;

  readonly phoneNumber: string;
  readonly email: string;

  category: string;
  name: string;
  ranking: string;
  rankingPosition: number;
  urlPhotoPlayer: string;
}