import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Absence {
  id: number;
  date: string; // Format ISO (ex: "2025-01-20")
  motif: string;
}

export interface Utilisateur {
  id: number;
  nom: string;
  absences: Absence[];
}

@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private apiUrl = 'http://localhost:8080/api/utilisateurs';

  constructor(private http: HttpClient) {}

  /**
   * Récupérer un utilisateur avec ses absences.
   * @param id Identifiant de l'utilisateur.
   * @returns Observable contenant l'utilisateur avec ses absences.
   */
  getUtilisateurAvecAbsences(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/${id}/absences`);
  }
}
