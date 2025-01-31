import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateursService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // Methode pour obtenir les utilisateurs d'un service
  getUsersByDepartement(departementId: number): Observable<any> {
    const url = `${this.apiUrl}/utilisateurs/departement/${departementId}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Methode pour obtenir les Absences par leurs id User
  getAbsencesByUser(userId: number): Observable<any> {
    const url = `${this.apiUrl}/absences/utilisateur/${userId}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Methode pour obtenir les Utilisateurs par leurs id User
  getUserById(userId: number): Observable<any> {
    const url = `${this.apiUrl}/utilisateurs/${userId}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Method to get Public Holidays from API (but not use cause don't work every time)
  // ---------- REWORK ----------
  getPublicHolidays(): Observable<any> {
    return this.http.get('/jours-feries/metropole.json');
  }


  // Gestion des erreurs
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}
