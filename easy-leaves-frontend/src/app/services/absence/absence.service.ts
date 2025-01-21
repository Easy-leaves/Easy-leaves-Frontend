import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {

  private apiUrl = 'http://localhost:8080/absences'; // Remplacez par l'URL de votre backend
  private apiJourFeriesUrl = 'https://calendrier.api.gouv.fr/jours-feries/';

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les absences
  getAbsencesByUtilisateurId(idUtilisateur: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/utilisateur/${idUtilisateur}`);
  }

  getHolidays(year: number): Observable<any> {
    return this.http.get<any>(`${this.apiJourFeriesUrl}/jours-feries/metropole/${year}.json`);
  }
}
