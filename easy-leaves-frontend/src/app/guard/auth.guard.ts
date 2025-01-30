import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private isLoading = false; // Track loading state

  constructor(private router: Router, private loginService: LoginService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('idUser');

      if (!token || !userId) {
        this.router.navigate(['/login']);
        return of(false);
      }

      // Prevent multiple requests if already loading
      if (this.isLoading) {
        return of(false);
      }
      this.isLoading = true;

      return this.loginService.getUserById(+userId).pipe(
        map((user) => {
          console.log("User Role:", user.role);
          sessionStorage.setItem('role', user.role);
          this.isLoading = false;

          const requiredRole = route.data['role'];
          if (!requiredRole || user.role === requiredRole) {
            sessionStorage.setItem('previousUrl', state.url);
            return true;
          }

          const previousUrl = sessionStorage.getItem('previousUrl') || '/';
          if (previousUrl !== '/login') {
            this.router.navigate([previousUrl]);
          }
          return false;
        }),
        catchError(() => {
          console.error("Error fetching user role");
          this.isLoading = false;
          this.router.navigate(['/login']);
          return of(false);
        }),
        finalize(() => {
          this.isLoading = false; // Ensure loading flag resets
        })
      );

    }

    this.router.navigate(['/login']);
    return of(false);
  }
}
