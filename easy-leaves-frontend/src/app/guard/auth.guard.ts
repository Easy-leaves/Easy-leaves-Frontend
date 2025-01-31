import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private isLoading = false; // Évite les requêtes multiples

  constructor(private router: Router, private loginService: LoginService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('idUser');

      // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
      if (!token || !userId) {
        this.router.navigate(['/login']);
        return of(false);
      }

      if (this.isLoading) {
        return of(false);
      }
      this.isLoading = true;

      return this.loginService.getUserById(+userId).pipe(
        map((user) => {
          sessionStorage.setItem('role', user.role);
          this.isLoading = false;

          const requiredRole = route.data['role'];
          if (!requiredRole || user.role === requiredRole) {
            sessionStorage.setItem('previousUrl', state.url);
            return true;
          }

          // Redirige vers l'URL précédente si l'accès est refusé
          const previousUrl = sessionStorage.getItem('previousUrl') || '/';
          if (previousUrl !== '/login') {
            this.router.navigate([previousUrl]);
          }
          return false;
        }),
        catchError(() => {
          console.error("Erreur lors de la récupération du rôle");
          this.isLoading = false;
          this.router.navigate(['/login']);
          return of(false);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      );
    }

    this.router.navigate(['/login']);
    return of(false);
  }
}
