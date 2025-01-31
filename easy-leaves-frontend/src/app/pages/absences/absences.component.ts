import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendrierAbsencesComponent } from '../../components/calendrier-absences/calendrier-absences.component';
import { DemandeAbsenceComponent } from '../../components/demande-absence/demande-absence.component';

@Component({
  selector: 'app-absences',
  standalone: true,
  imports: [
    CommonModule,
    CalendrierAbsencesComponent,
    DemandeAbsenceComponent,
  ],
  templateUrl:'./absences.component.html',
  styleUrls: ['./absences.component.css'],
})
export class AbsencesComponent {
	  vueActive: string = 'calendrier';

	  changerVue(vue: string) {
	    this.vueActive = vue;
	  }
}