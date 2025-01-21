import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {

  private apiUrl = 'http://localhost:8080/absences'; // Remplacez par l'URL de votre backend
  private apiJourFeriesUrl = 'https://date.nager.at/api/v3/publicholidays';

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les absences
  getAbsencesByUtilisateurId(idUtilisateur: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/utilisateur/${idUtilisateur}`);
  }

  getHolidays(year: number, country: string): Observable<any> {
    const url = `${this.apiJourFeriesUrl}/${year}/${country}`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error fetching holidays', error);
        return throwError('Something went wrong; please try again later.');
      })
    );
  }
}
