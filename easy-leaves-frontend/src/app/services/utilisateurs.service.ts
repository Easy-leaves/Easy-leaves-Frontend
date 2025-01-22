import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateursService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // Method to fetch data for role 1
  getUsersByDepartement(departementId: number = 1): Observable<any> {
    const url = `${this.apiUrl}/utilisateurs/departement/${departementId}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  getAbsencesByUser(userId: number): Observable<any> {
    const url = `${this.apiUrl}/absences/utilisateur/${userId}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }


  getPublicHolidays(): Observable<any> {
    return this.http.get('/jours-feries/metropole.json');
  }


  // Error handling method
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}
