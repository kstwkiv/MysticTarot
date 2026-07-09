import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AiReadingRequest, AiReadingResponse, Reading } from '../models/reading.model';
import { TarotCard } from '../models/tarot-card.model';

@Injectable({
  providedIn: 'root'
})
export class ReadingService {
  private readonly API_URL = '/api/readings';

  constructor(private http: HttpClient) {}

  performAiReading(request: AiReadingRequest): Observable<AiReadingResponse> {
    return this.http.post<AiReadingResponse>(`${this.API_URL}/ai`, request);
  }

  getMyReadings(): Observable<Reading[]> {
    return this.http.get<Reading[]>(`${this.API_URL}/my`);
  }

  getReadingById(id: string): Observable<Reading> {
    return this.http.get<Reading>(`${this.API_URL}/${id}`);
  }

  drawCards(count: number): Observable<TarotCard[]> {
    return this.http.post<TarotCard[]>(`${this.API_URL}/cards/draw`, { count });
  }

  getAllCards(): Observable<TarotCard[]> {
    return this.http.get<TarotCard[]>(`${this.API_URL}/cards`);
  }
}
