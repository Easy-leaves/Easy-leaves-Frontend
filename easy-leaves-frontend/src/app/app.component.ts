// Importation des modules et composants nécessaires
import { Component, OnInit, NgModule } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { EditAbsenceDialogComponent } from './pages/edit-absence-dialog/edit-absence-dialog.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule, FooterComponent, FormsModule, RouterModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'easy-leaves-frontend';
  showHeader = true; // Affiche ou masque l'en-tête selon la page
  isLoading = false; // Indique si un chargement est en cours

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true; // Active l'écran de chargement
      }
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.isLoading = false;
          this.showHeader = !event.urlAfterRedirects.includes('login'); // Cache l'en-tête sur la page de connexion
        }, 300);
      }
    });
  }
}
