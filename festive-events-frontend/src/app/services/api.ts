import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, FestiveEvent } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // ===== MÉTODOS PARA USUÁRIOS =====

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user, { headers: this.getHeaders() });
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, user, { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  // ===== MÉTODOS PARA EVENTOS =====

  getEvents(): Observable<FestiveEvent[]> {
    return this.http.get<FestiveEvent[]>(`${this.baseUrl}/events`);
  }

  getEvent(id: number): Observable<FestiveEvent> {
    return this.http.get<FestiveEvent>(`${this.baseUrl}/events/${id}`);
  }

  createEvent(event: FestiveEvent): Observable<FestiveEvent> {
    return this.http.post<FestiveEvent>(`${this.baseUrl}/events`, event, { headers: this.getHeaders() });
  }

  updateEvent(id: number, event: FestiveEvent): Observable<FestiveEvent> {
    return this.http.put<FestiveEvent>(`${this.baseUrl}/events/${id}`, event, { headers: this.getHeaders() });
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/events/${id}`);
  }

  getUserEvents(userId: number): Observable<FestiveEvent[]> {
    return this.http.get<FestiveEvent[]>(`${this.baseUrl}/events/user/${userId}`);
  }

  // ===== MÉTODO PARA UPLOAD DE IMAGEM =====

  uploadImage(file: File): Observable<{image_url: string}> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{image_url: string}>(`${this.baseUrl}/upload`, formData);
  }

  // ===== MÉTODO PARA AUTENTICAÇÃO =====

  login(username: string, password: string): Observable<{message: string, user: User}> {
    return this.http.post<{message: string, user: User}>(`${this.baseUrl}/auth/login`, 
      { username, password }, 
      { headers: this.getHeaders() }
    );
  }
}

