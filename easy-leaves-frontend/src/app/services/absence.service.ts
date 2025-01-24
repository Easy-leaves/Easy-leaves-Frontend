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

  getAbsencesByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/utilisateur/${userId}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des absences pour cet utilisateur:', error);
        return throwError('Erreur de récupération des absences');
      })
    );
  }

  addAbsence(absence: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, absence);
  }

  updateAbsence(id: number, absence: any): Observable<any> {
    // Validation côté frontend
    if (new Date(absence.dateFin) < new Date(absence.dateDebut)) {
      return throwError('La date de début ne peut pas être inférieure à la date de fin');
    }

    if (new Date(absence.dateDebut) < new Date()) {
      return throwError('La date de début ne peut pas être inférieure à aujourd\'hui');
    }

    return this.http.put<any>(`${this.baseUrl}/update/${id}`, absence);
  }



  deleteAbsence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; // Assurez-vous d'importer throwError
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  private baseUrl = 'http://localhost:8080/absences';

  constructor(private http: HttpClient) { }

  getAbsencesByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/utilisateur/${userId}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des absences pour cet utilisateur:', error);
        return throwError('Erreur de récupération des absences');
      })
    );
  }

  addAbsence(absence: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, absence);
  }

  updateAbsence(id: number, absence: any): Observable<any> {
    // Validation côté frontend
    if (new Date(absence.dateFin) < new Date(absence.dateDebut)) {
      return throwError('La date de début ne peut pas être inférieure à la date de fin');
    }

    if (new Date(absence.dateDebut) < new Date()) {
      return throwError('La date de début ne peut pas être inférieure à aujourd\'hui');
    }

    return this.http.put<any>(`${this.baseUrl}/update/${id}`, absence);
  }



  deleteAbsence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
