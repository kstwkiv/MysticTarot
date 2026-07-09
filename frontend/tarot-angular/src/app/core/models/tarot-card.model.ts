export type Arcana = 'Major' | 'Minor';
export type Suit = 'Wands' | 'Cups' | 'Swords' | 'Pentacles';

export interface TarotCard {
  name: string;
  arcana: Arcana;
  suit?: Suit;
  number: number;
  description: string;
  imageUrl: string;
  uprightMeaning: string;
  reversedMeaning: string;
  isReversed: boolean;
}
