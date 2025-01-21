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

  // Récupérer toutes les absences
  getAllAbsences(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des absences:', error); // Log détaillé
        return throwError('Erreur de récupération des absences'); // Message générique pour l'utilisateur
      })
    );
  }


  // Récupérer une absence par ID
  getAbsenceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Créer une nouvelle absence
  createAbsence(absence: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, absence);
  }

  // Mettre à jour une absence
  updateAbsence(id: number, absence: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, absence);
  }

  // Supprimer une absence
  deleteAbsence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  getAbsencesByStatut(statut: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/statut/${statut}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des absences par statut:', error);
        return throwError('Erreur de récupération des absences');
      })
    );
  }

  // Récupérer les absences pour un utilisateur spécifique
  getAbsencesByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/utilisateur/${userId}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des absences pour cet utilisateur:', error);
        return throwError('Erreur de récupération des absences');
      })
    );
  }



  // Récupérer les absences dans une plage de dates
  getAbsencesByDateRange(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/plage/${startDate}/${endDate}`);
  }

  // Compter les absences par utilisateur et statut
  countAbsences(utilisateurId: number, statut: string): Observable<number> {
    return this.http.get<number>(
      `${this.baseUrl}/compte/${utilisateurId}/${statut}`
    );
  }
}
