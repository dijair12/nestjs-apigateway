export interface Category extends Document {
  _id: string;

  category: string;

  description: string;

  events: Array<Event>;
}

export interface Event {
  name: string;

  operation: string;

  value: number;
}