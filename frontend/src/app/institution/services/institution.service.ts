import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';

// ===== INTERFACES =====

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
  created_at: string;
  updated_at: string;
  time_slots?: TimeSlot[];
}

export interface CreateActivityRequest {
  name: string;
  description: string;
  category: string;
  age_from: number;
  age_to: number;
  price: number;
}

export interface Location {
  id: number;
  institution_user_id: number;
  name: string;
  address: string;
  city: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLocationRequest {
  name: string;
  address: string;
  city: string;
}

export interface TimeSlot {
  id: number;
  activity_id: number;
  institution_user_id: number;
  location_id: number;
  date: string;
  time_from: string;
  time_to: string;
  capacity: number;
  booked: number;
  available: boolean;
  created_at: string;
  updated_at: string;
  activity?: { id: number; name: string };
  location?: { id: number; name: string; address: string };
}

export interface CreateTimeSlotRequest {
  activity_id: number;
  location_id: number;
  date: string;
  time_from: string;
  time_to: string;
  capacity: number;
  available?: boolean;
}

export interface Reservation {
  id: number;
  parent_user_id: number;
  child_id: number;
  activity_id: number;
  time_slot_id: number;
  institution_user_id: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  note: string | null;
  created_at: string;
  updated_at: string;
  parent?: { id: number; name: string; email: string };
  child?: { id: number; first_name: string; last_name: string; age: number };
  activity?: { id: number; name: string };
  time_slot?: TimeSlot;
}

// ===== SERVICE =====

@Injectable({
  providedIn: 'root',
})
export class InstitutionService {
  private api = inject(ApiService);

  // ===== ACTIVITIES =====

  getActivities(): Observable<{ activities: Activity[] }> {
    return this.api.get('/institution/activities');
  }

  getActivity(id: number): Observable<{ activity: Activity }> {
    return this.api.get(`/institution/activities/${id}`);
  }

  createActivity(data: CreateActivityRequest): Observable<{ message: string; activity: Activity }> {
    return this.api.post('/institution/activities', data);
  }

  updateActivity(
    id: number,
    data: Partial<CreateActivityRequest>
  ): Observable<{ message: string; activity: Activity }> {
    return this.api.put(`/institution/activities/${id}`, data);
  }

  deleteActivity(id: number): Observable<{ message: string }> {
    return this.api.delete(`/institution/activities/${id}`);
  }

  // ===== LOCATIONS =====

  getLocations(): Observable<{ locations: Location[] }> {
    return this.api.get('/institution/locations');
  }

  getLocation(id: number): Observable<{ location: Location }> {
    return this.api.get(`/institution/locations/${id}`);
  }

  createLocation(data: CreateLocationRequest): Observable<{ message: string; location: Location }> {
    return this.api.post('/institution/locations', data);
  }

  updateLocation(
    id: number,
    data: Partial<CreateLocationRequest>
  ): Observable<{ message: string; location: Location }> {
    return this.api.put(`/institution/locations/${id}`, data);
  }

  deleteLocation(id: number): Observable<{ message: string }> {
    return this.api.delete(`/institution/locations/${id}`);
  }

  // ===== TIME SLOTS =====

  getTimeSlots(): Observable<{ time_slots: TimeSlot[] }> {
    return this.api.get('/institution/time-slots');
  }

  getTimeSlot(id: number): Observable<{ time_slot: TimeSlot }> {
    return this.api.get(`/institution/time-slots/${id}`);
  }

  createTimeSlot(
    data: CreateTimeSlotRequest
  ): Observable<{ message: string; time_slot: TimeSlot }> {
    return this.api.post('/institution/time-slots', data);
  }

  updateTimeSlot(
    id: number,
    data: Partial<CreateTimeSlotRequest>
  ): Observable<{ message: string; time_slot: TimeSlot }> {
    return this.api.put(`/institution/time-slots/${id}`, data);
  }

  deleteTimeSlot(id: number): Observable<{ message: string }> {
    return this.api.delete(`/institution/time-slots/${id}`);
  }

  // ===== RESERVATIONS =====

  getReservations(status?: string): Observable<{ reservations: Reservation[] }> {
    const params = status ? `?status=${status}` : '';
    return this.api.get(`/institution/reservations${params}`);
  }

  getReservation(id: number): Observable<{ reservation: Reservation }> {
    return this.api.get(`/institution/reservations/${id}`);
  }

  approveReservation(id: number): Observable<{ message: string; reservation: Reservation }> {
    return this.api.post(`/institution/reservations/${id}/approve`, {});
  }

  rejectReservation(id: number): Observable<{ message: string; reservation: Reservation }> {
    return this.api.post(`/institution/reservations/${id}/reject`, {});
  }
}
