import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('idUser');

      if (!token || !userId) {
        this.router.navigate(['/login']);
        return of(false);
      }

      return this.loginService.getUserById(+userId).pipe(
        map((user) => {
          console.log("User Role:", user.role);
          sessionStorage.setItem('role', user.role);

          const requiredRole = route.data['role'];
          if (!requiredRole || user.role === requiredRole) {
            sessionStorage.setItem('previousUrl', state.url);
            return true;
          }

          const previousUrl = sessionStorage.getItem('previousUrl') || '/';
          if (previousUrl != '/login') {
            this.router.navigate([previousUrl]);
          }
          return false;
        }),
        catchError(() => {
          console.error("Error fetching user role");
          this.router.navigate(['/login']);
          return of(false);
        })
      );

    }

    this.router.navigate(['/login']);
    return of(false);
  }
}
