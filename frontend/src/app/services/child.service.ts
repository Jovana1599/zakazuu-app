import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Child {
  id: number;
  parent_user_id: number;
  first_name: string;
  last_name: string;
  age: number;
  medical_restrictions: string | null;
  note: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateChildRequest {
  first_name: string;
  last_name: string;
  age: number;
  medical_restrictions?: string;
  note?: string;
}

export interface UpdateChildRequest {
  first_name?: string;
  last_name?: string;
  age?: number;
  medical_restrictions?: string;
  note?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChildService {
  constructor(private api: ApiService) {}

  // Dohvatanje sve dece roditelja
  getMyChildren(): Observable<Child[]> {
    return this.api.get<Child[]>('/parent/children');
  }

  // Dohvatanje jednog deteta
  getChild(id: number): Observable<Child> {
    return this.api.get<Child>(`/parent/children/${id}`);
  }

  // Dodavanje novog deteta
  createChild(data: CreateChildRequest): Observable<{ message: string; child: Child }> {
    return this.api.post('/parent/children', data);
  }

  // Ažuriranje deteta
  updateChild(id: number, data: UpdateChildRequest): Observable<{ message: string; child: Child }> {
    return this.api.put(`/parent/children/${id}`, data);
  }

  // Brisanje deteta
  deleteChild(id: number): Observable<{ message: string }> {
    return this.api.delete(`/parent/children/${id}`);
  }
}
