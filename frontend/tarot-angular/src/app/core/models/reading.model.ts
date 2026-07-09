import { TarotCard } from './tarot-card.model';

export type SpreadType = 'SingleCard' | 'ThreeCard' | 'CelticCross';

export interface Reading {
  id: string;
  userId: string;
  spreadType: SpreadType;
  question?: string;
  cards: TarotCard[] | string;
  interpretation: string;
  createdAt: string;
}

export interface AiReadingRequest {
  spreadType: SpreadType;
  question?: string;
}

export interface AiReadingResponse {
  id: string;
  userId: string;
  spreadType: SpreadType;
  question?: string;
  cards: TarotCard[];
  interpretation: string;
  createdAt: string;
}
