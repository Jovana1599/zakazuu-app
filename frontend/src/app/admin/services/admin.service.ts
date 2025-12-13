import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';

export interface User {
  id: number;
  name: string;
  email: string;
  role_as: number;
  phone?: string;
  description?: string;
  website?: string;
  created_at: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  user: { id: number; name: string };
  institution: { id: number; name: string };
  created_at: string;
}

export interface UsersResponse {
  users: User[];
}

export interface ReviewsResponse {
  reviews: Review[];
}

export interface UserResponse {
  message: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly api = inject(ApiService);

  // Users
  getUsers(role?: number): Observable<UsersResponse> {
    const query = role !== undefined ? `?role=${role}` : '';
    return this.api.get<UsersResponse>(`/admin/users${query}`);
  }

  getUser(id: number): Observable<User> {
    return this.api.get<User>(`/admin/users/${id}`);
  }

  updateUser(id: number, data: Partial<User>): Observable<UserResponse> {
    return this.api.put<UserResponse>(`/admin/users/${id}`, data);
  }

  deleteUser(id: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/admin/users/${id}`);
  }

  // Reviews
  getReviews(): Observable<ReviewsResponse> {
    return this.api.get<ReviewsResponse>('/admin/reviews');
  }

  deleteReview(id: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/admin/reviews/${id}`);
  }
}
