export type ReadingType = 'HumanReading' | 'AiReading';
export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  readingType: ReadingType;
  scheduledAt: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBookingRequest {
  clientName: string;
  clientEmail: string;
  readingType: ReadingType;
  scheduledAt: string;
  notes?: string;
}
