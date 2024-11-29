import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {Statut} from '../enums/Statut';

@Injectable({
  providedIn: 'root'
})
export class AbsencesService {
	private apiUrl = 'http://localhost:8080';
	private headers = new HttpHeaders().set('Content-Type', 'application/json');

  	constructor(private http: HttpClient) { }
  
  	// Récupérer la liste des absences en fonction du statut
    getAbsencesByStatus(statut: string): Observable<any> {
      return this.http.get<any[]>(`${this.apiUrl}/absences/statut/${statut}`, { headers: this.headers, withCredentials: true });
    }

    // Valider une absence
    validateAbsence(id: number): Observable<any> {
      return this.http.put(`${this.apiUrl}/absences/update/${id}/statut`, Statut.VALIDEE);
    }

    // Refuser une absence
    refuseAbsence(id: number): Observable<any> {
      return this.http.put(`${this.apiUrl}/absences/update/${id}/statut`, Statut.REFUSEE);
    }
}
