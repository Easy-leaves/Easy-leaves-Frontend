import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deconnexion',
  templateUrl: './deconnexion.component.html',
  styleUrl: './deconnexion.component.css'
})
export class DeconnexionComponent {
  constructor(private router: Router) {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
