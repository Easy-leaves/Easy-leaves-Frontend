import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root', // Fournit le service à l'ensemble de l'application
})
export class AbsenceService {
  private baseUrl = 'http://localhost:8080/absences'; // URL de l'API backend

  constructor(private http: HttpClient) { }

  /**
   * Génère les en-têtes HTTP contenant le token d'authentification.
   * @returns HttpHeaders contenant l'autorisation Bearer.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
  }

  /**
   * Récupère les absences de l'utilisateur authentifié.
   * @returns Un Observable contenant un tableau d'absences.
   */
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

  /**
   * Ajoute une nouvelle absence pour l'utilisateur.
   * @param absence Objet contenant les informations de l'absence.
   * @returns Un Observable contenant la réponse du serveur.
   */
  addAbsence(absence: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, absence, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error("Erreur lors de l'ajout de l'absence :", error);
        return throwError('Erreur d\'ajout de l\'absence');
      })
    );
  }

  /**
   * Met à jour une absence existante.
   * Vérifie que la date de début est correcte avant l'envoi.
   * @param id Identifiant de l'absence à modifier.
   * @param absence Objet contenant les nouvelles données de l'absence.
   * @returns Un Observable contenant la réponse du serveur.
   */
  updateAbsence(id: number, absence: any): Observable<any> {
    if (new Date(absence.dateFin) < new Date(absence.dateDebut)) {
      return throwError('La date de début ne peut pas être postérieure à la date de fin');
    }

    if (new Date(absence.dateDebut) < new Date()) {
      return throwError('La date de début ne peut pas être antérieure à aujourd\'hui');
    }

    return this.http.put<any>(`${this.baseUrl}/update/${id}`, absence, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error("Erreur lors de la mise à jour de l'absence :", error);
        return throwError('Erreur de mise à jour de l\'absence');
      })
    );
  }

  /**
   * Supprime une absence existante.
   * @param id Identifiant de l'absence à supprimer.
   * @returns Un Observable sans retour (void).
   */
  deleteAbsence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error("Erreur lors de la suppression de l'absence :", error);
        return throwError('Erreur de suppression de l\'absence');
      })
    );
  }
}
