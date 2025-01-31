import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Statut } from '../../enums/Statut';
import { AbsenceModel } from '../../components/ViewModels/AbsenceModel';

@Injectable({
  providedIn: 'root',
})
export class AbsencesService {
  private apiUrl = 'http://localhost:8080/absences';
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

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

    return this.http.get<any[]>(`${this.apiUrl}/utilisateur/${userId}`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des absences :', error);
        return throwError('Erreur de récupération des absences');
      })
    );
  }

  // Méthode pour récupérer les absences d'un utilisateur
  getAbsencesByUtilisateurId(idUtilisateur: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/utilisateur/${idUtilisateur}`, {
        headers: this.headers,
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  // Récupérer la liste des absences en fonction du statut
  getAbsencesByStatus(statut: string): Observable<any> {
    return this.http
      .get<any[]>(`${this.apiUrl}/statut/${statut}`, {
        headers: this.headers,
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  // Récupérer la liste des absences en fonction du type
  getAbsencesByType(type: string): Observable<any> {
    return this.http
      .get<any[]>(`${this.apiUrl}/type/${type}`, {
        headers: this.headers,
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Ajoute une nouvelle absence pour l'utilisateur.
   * @param absence Objet contenant les informations de l'absence.
   * @returns Un Observable contenant la réponse du serveur.
   */
  addAbsence(absence: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, absence, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error("Erreur lors de l'ajout de l'absence :", error);
        return throwError('Erreur d\'ajout de l\'absence');
      })
    );
  }

  // Valider une absence
  validateAbsence(id: number): Observable<any> {
    return this.http
      .put(
        `${this.apiUrl}/update/${id}/statut`,
        { statut: Statut.VALIDEE }, // Envoyer un objet explicite
        { headers: this.headers, withCredentials: true }
      )
      .pipe(catchError(this.handleError));
  }

  // Refuser une absence
  refuseAbsence(id: number): Observable<any> {
    return this.http
      .put(
        `${this.apiUrl}/update/${id}/statut`,
        { statut: Statut.REFUSEE }, // Envoyer un objet explicite
        { headers: this.headers, withCredentials: true }
      )
      .pipe(catchError(this.handleError));
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
  
      return this.http.put<any>(`${this.apiUrl}/update/${id}`, absence, {
        headers: this.getAuthHeaders(),
      }).pipe(
        catchError((error) => {
          console.error("Erreur lors de la mise à jour de l'absence :", error);
          return throwError('Erreur de mise à jour de l\'absence');
        })
      );
    }

  // Mettre à jour un jour férié
  updateHoliday(absence: AbsenceModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${absence.id}`, absence, {
      headers: this.headers,
      withCredentials: true,
    });
  }

    /**
   * Supprime une absence existante.
   * @param id Identifiant de l'absence à supprimer.
   * @returns Un Observable sans retour (void).
   */
    deleteAbsence(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, {
        headers: this.getAuthHeaders(),
      }).pipe(
        catchError((error) => {
          console.error("Erreur lors de la suppression de l'absence :", error);
          return throwError('Erreur de suppression de l\'absence');
        })
      );
    }

  // Ajouter un congé
  addHoliday(holiday: AbsenceModel): Observable<AbsenceModel> {
    return this.http.post<AbsenceModel>(
      `${this.apiUrl}/add`,
      holiday
    )
    .pipe(catchError(this.handleError));
  }

  // Ajouter un RTT employeur
  addRTTEmployeur(absence: AbsenceModel): Observable<AbsenceModel> {
    return this.http.post<AbsenceModel>(
      `${this.apiUrl}/rtt-employeur/add`,
      absence,
      { headers: this.headers, withCredentials: true }
    )
    .pipe(catchError(this.handleError));
  }

  // Modifier un RTT employeur
  updateRTTEmployeur(absence: AbsenceModel): Observable<AbsenceModel> {
    return this.http.put<AbsenceModel>(
      `${this.apiUrl}/update/${absence.id}`,
      absence,
      { headers: this.headers, withCredentials: true }
    )
    .pipe(catchError(this.handleError));
  }

  // Supprimer un RTT employeur
  deleteRTTEmployeur(id: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/delete/${id}`, {
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

  // Obtenir le nombre de RTT Employeur restant
  getRttEmployeurCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/rtt-employeur/count`, {
      headers: this.headers,
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }
}

