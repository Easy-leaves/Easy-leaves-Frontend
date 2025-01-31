import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  userRole: string | null = null; // Stocke le rôle de l'utilisateur
  isCheckingAuth = true; // Indique si l'authentification est en cours

  ngOnInit() {
    setTimeout(() => {
      // Récupère le rôle de l'utilisateur depuis sessionStorage
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        this.userRole = sessionStorage.getItem('role');
      }
      this.isCheckingAuth = false;
    }, 0);
  }
}
