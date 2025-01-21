import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  seConnecter(data: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/auth/authenticate`, data).pipe(
      catchError(error => {
        console.error("Error occurred:", error);
        return throwError(() => error);
      })
    );
  }
}
