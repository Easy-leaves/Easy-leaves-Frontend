

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  private baseUrl = 'http://localhost:8080/absences';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log("Token envoyé:", token);
    return new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
  }

  getAbsencesByUser(): Observable<any[]> {
    const userId = localStorage.getItem('idUser');
    if (!userId) {
      throw new Error('Utilisateur non authentifié.');
    }

    return this.http.get<any[]>(`${this.baseUrl}/utilisateur/${userId}`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des absences :', error);
        return throwError('Erreur de récupération des absences');
      })
    );
  }


  addAbsence(absence: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, absence, {
      headers: this.getAuthHeaders(),
    });
  }

  updateAbsence(id: number, absence: any): Observable<any> {
    if (new Date(absence.dateFin) < new Date(absence.dateDebut)) {
      return throwError('La date de début ne peut pas être inférieure à la date de fin');
    }

    if (new Date(absence.dateDebut) < new Date()) {
      return throwError('La date de début ne peut pas être inférieure à aujourd\'hui');
    }

    return this.http.put<any>(`${this.baseUrl}/update/${id}`, absence, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteAbsence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
