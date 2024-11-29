import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionCongeComponent } from './gestion-absences/gestion-absences.component';


@Component({
  selector: 'app-liste-collaborateur',
  standalone: true,
  imports: [CommonModule, GestionCongeComponent],
  templateUrl: './liste-collaborateur.component.html',
  styleUrl: './liste-collaborateur.component.css'
})
export class ListeCollaborateurComponent {
	// Propriété pour suivre la vue active
	  vueActive: string = 'gestionAbsences';

	  // Méthode pour changer la vue active
	  changerVue(vue: string) {
	    this.vueActive = vue;
	  }
}
