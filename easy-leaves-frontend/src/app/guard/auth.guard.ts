import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  canActivate(): boolean {
    if (this.isLocalStorageAvailable()) {
      const token = localStorage.getItem('token');
      if (token) {
        return true;
      }
    }

    // No token or localStorage unavailable, redirect to login
    this.router.navigate(['/login']);
    return false;
  }
}
