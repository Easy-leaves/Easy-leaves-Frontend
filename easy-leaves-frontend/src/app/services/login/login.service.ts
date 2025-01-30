import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  seConnecter(data: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/authenticate`, data).pipe(
      catchError(error => {
        console.error("Error occurred:", error);
        return throwError(() => error);
      })
    );
  }

  getUserById(userId: number): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (!token) {
      console.error("No token found!");
      return throwError(() => new Error("No token found!"));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/utilisateurs/${userId}`, { headers }).pipe(
      catchError(error => {
        console.error("Error fetching user:", error);
        return throwError(() => error);
      })
    );
  }
}
