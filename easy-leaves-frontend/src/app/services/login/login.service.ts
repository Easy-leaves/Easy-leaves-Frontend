import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // Méthode pour envoyer les identifiants de connexion
  seConnecter(data: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/authenticate`, data).pipe(
      catchError(error => {
        console.error("Erreur lors de l'authentification:", error);
        return throwError(() => error);
      })
    );
  }

  // Méthode pour récupérer un utilisateur par son ID
  getUserById(userId: number): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("Aucun token trouvé !");
      return throwError(() => new Error("Aucun token trouvé !"));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/utilisateurs/${userId}`, { headers }).pipe(
      catchError(error => {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        return throwError(() => error);
      })
    );
  }
}
