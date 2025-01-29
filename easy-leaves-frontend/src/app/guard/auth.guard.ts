import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('idUser');

      if (!token || !userId) {
        this.router.navigate(['/login']);
        return of(false);
      }

      // Fetch user role
      return this.loginService.getUserById(+userId).pipe(
        map((user) => {
          const requiredRole = route.data['role'];
          if (!requiredRole || user.role === requiredRole) {
            return true;
          }
          this.router.navigate(['/']);
          return false;
        }),
        catchError(() => {
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    }

    this.router.navigate(['/login']);
    return of(false);
  }
}
