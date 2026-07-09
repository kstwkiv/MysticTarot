import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, CreateBookingRequest } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly API_URL = '/api/bookings';

  constructor(private http: HttpClient) {}

  createBooking(request: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.API_URL, request);
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.API_URL);
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.API_URL}/my`);
  }

  getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.API_URL}/${id}`);
  }

  confirmBooking(id: string): Observable<Booking> {
    return this.http.put<Booking>(`${this.API_URL}/${id}/confirm`, {});
  }

  cancelBooking(id: string): Observable<Booking> {
    return this.http.put<Booking>(`${this.API_URL}/${id}/cancel`, {});
  }
}
