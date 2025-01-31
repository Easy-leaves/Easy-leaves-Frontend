import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Statut } from '../enums/Statut';
import { AbsenceModel } from '../components/ViewModels/AbsenceModel';

@Injectable({
  providedIn: 'root',
})
export class AbsencesService {
  private apiUrl = 'http://localhost:8080';
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  // Récupérer la liste des absences en fonction du statut
  getAbsencesByStatus(statut: string): Observable<any> {
    return this.http
      .get<any[]>(`${this.apiUrl}/absences/statut/${statut}`, {
        headers: this.headers,
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  // Récupérer la liste des absences en fonction du type
  getAbsencesByType(type: string): Observable<any> {
    return this.http
      .get<any[]>(`${this.apiUrl}/absences/type/${type}`, {
        headers: this.headers,
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  // Valider une absence
  validateAbsence(id: number): Observable<any> {
    return this.http
      .put(
        `${this.apiUrl}/absences/update/${id}/statut`,
        { statut: Statut.VALIDEE }, // Envoyer un objet explicite
        { headers: this.headers, withCredentials: true }
      )
      .pipe(catchError(this.handleError));
  }

  // Refuser une absence
  refuseAbsence(id: number): Observable<any> {
    return this.http
      .put(
        `${this.apiUrl}/absences/update/${id}/statut`,
        { statut: Statut.REFUSEE }, // Envoyer un objet explicite
        { headers: this.headers, withCredentials: true }
      )
      .pipe(catchError(this.handleError));
  }

  // Mettre à jour un jour férié
  updateHoliday(absence: AbsenceModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/absences/update/${absence.id}`, absence, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  deleteAbsence(id: number): Observable<any> {
    return this.http
    .delete(
      `${this.apiUrl}/absences/delete/${id}`,
      { headers: this.headers, withCredentials: true }
    )
    .pipe(catchError(this.handleError));
  }

  addHoliday(holiday: AbsenceModel): Observable<AbsenceModel> {
    return this.http.post<AbsenceModel>(
      `${this.apiUrl}/absences/add`,
      holiday
    )
    .pipe(catchError(this.handleError));
  }

  // Ajouter un RTT employeur
  addRTTEmployeur(absence: AbsenceModel): Observable<AbsenceModel> {
    return this.http.post<AbsenceModel>(
      `${this.apiUrl}/absences/rtt-employeur/add`,
      absence,
      { headers: this.headers, withCredentials: true }
    )
    .pipe(catchError(this.handleError));
  }

  // Modifier un RTT employeur
  updateRTTEmployeur(absence: AbsenceModel): Observable<AbsenceModel> {
    return this.http.put<AbsenceModel>(
      `${this.apiUrl}/absences/update/${absence.id}`,
      absence,
      { headers: this.headers, withCredentials: true }
    )
    .pipe(catchError(this.handleError));
  }

  // Supprimer un RTT employeur
  deleteRTTEmployeur(id: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/absences/delete/${id}`, {
        headers: this.headers,
        withCredentials: true
      })
      .pipe(catchError(this.handleError));
  }

  // Méthode de gestion des erreurs
  private handleError(error: any): Observable<never> {
    console.error('Une erreur est survenue :', error);
    return throwError(() => new Error(error.message || 'Erreur serveur'));
  }

  getRttEmployeurCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/absences/rtt-employeur/count`, {
      headers: this.headers,
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }
}

