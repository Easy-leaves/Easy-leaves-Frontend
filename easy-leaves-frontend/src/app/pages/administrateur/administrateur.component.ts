import { Component } from '@angular/core';
import { GestionJourFeriesComponent } from '../../components/gestion-jour-feries/gestion-jour-feries.component';
import { CommonModule } from '@angular/common';
import { GestionRttEmployeurComponent } from '../../components/gestion-rtt-employeur/gestion-rtt-employeur.component';

@Component({
  selector: 'app-administrateur',
  standalone: true,
  imports: [CommonModule, GestionJourFeriesComponent, GestionRttEmployeurComponent],
  templateUrl: './administrateur.component.html',
  styleUrl: './administrateur.component.css'
})
export class AdministrateurComponent {
	// Propriété pour suivre la vue active
  vueActive: string = 'jours fériés';

  // Méthode pour changer la vue active
  changerVue(vue: string) {
    this.vueActive = vue;
  }
}
