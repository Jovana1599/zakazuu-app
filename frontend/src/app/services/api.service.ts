import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // GET request
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, {
      headers: this.getHeaders(),
    });
  }

  // POST request
  post<T>(endpoint: string, body: any): Observable<T> {
    const isFormData = body instanceof FormData;
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, body, {
      headers: this.getHeaders(isFormData),
    });
  }

  // PUT request
  put<T>(endpoint: string, body: any): Observable<T> {
    const isFormData = body instanceof FormData;
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, body, {
      headers: this.getHeaders(isFormData),
    });
  }

  // DELETE request
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`, {
      headers: this.getHeaders(),
    });
  }

  // Priprema headers sa tokenom
  private getHeaders(isFormData = false): HttpHeaders {
    const token = localStorage.getItem('access_token');

    let headers = new HttpHeaders({
      Accept: 'application/json',
    });

    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
}
