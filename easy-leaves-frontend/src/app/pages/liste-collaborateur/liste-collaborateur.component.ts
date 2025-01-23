import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionCongeComponent } from '../../components/gestion-absences/gestion-absences.component';
import { ListeCongesComponent } from '../../components/liste-conges/liste-conges.component';

@Component({
  selector: 'app-liste-collaborateur',
  standalone: true,
  imports: [CommonModule, GestionCongeComponent, ListeCongesComponent],
  templateUrl: './liste-collaborateur.component.html',
  styleUrls: ['./liste-collaborateur.component.css']
})
export class ListeCollaborateurComponent {
	// Propriété pour suivre la vue active
	  vueActive: string = 'liste';

	  // Méthode pour changer la vue active
	  changerVue(vue: string) {
	    this.vueActive = vue;
	  }
}
