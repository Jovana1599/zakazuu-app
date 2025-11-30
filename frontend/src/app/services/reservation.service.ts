import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Reservation {
  id: number;
  parent_user_id: number;
  child_id: number;
  time_slot_id: number;
  activity_id: number;
  institution_user_id: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  note: string | null;
  created_at: string;
  updated_at: string;
  child?: Child;
  activity?: Activity;
  time_slot?: TimeSlot;
  institution?: User;
}

export interface Child {
  id: number;
  parent_user_id: number;
  first_name: string;
  last_name: string;
  age: number;
  medical_restrictions: string | null;
  note: string | null;
}

export interface Activity {
  id: number;
  institution_user_id: number;
  name: string;
  description: string;
  category: string;
  age_from: number;
  age_to: number;
  price: number;
  image_url: string | null;
}

export interface TimeSlot {
  id: number;
  activity_id: number;
  institution_user_id: number;
  location_id: number;
  date: string;
  time_from: string;
  time_to: string;
  available: boolean;
  capacity: number;
  booked: number;
  location?: Location;
}

export interface Location {
  id: number;
  address: string;
  city: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CreateReservationRequest {
  child_id: number;
  activity_id: number;
  time_slot_id: number;
  note?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  constructor(private api: ApiService) {}

  // Kreiranje nove rezervacije
  createReservation(
    data: CreateReservationRequest
  ): Observable<{ message: string; reservation: Reservation }> {
    return this.api.post('/parent/reservations', data);
  }

  // Dohvatanje svih rezervacija roditelja
  getMyReservations(): Observable<Reservation[]> {
    return this.api.get<Reservation[]>('/parent/reservations');
  }

  // Dohvatanje jedne rezervacije
  getReservation(id: number): Observable<Reservation> {
    return this.api.get<Reservation>(`/parent/reservations/${id}`);
  }

  // Otkazivanje rezervacije
  cancelReservation(id: number): Observable<{ message: string; reservation: Reservation }> {
    return this.api.post(`/parent/reservations/${id}/cancel`, {});
  }
}
