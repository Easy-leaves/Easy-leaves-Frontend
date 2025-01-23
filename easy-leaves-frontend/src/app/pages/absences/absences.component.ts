import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendrierAbsencesComponent } from '../../components/calendrier-absences/calendrier-absences.component';

@Component({
  selector: 'app-absences',
  standalone: true,
  imports: [
    CommonModule,
    CalendrierAbsencesComponent,
  ],
  template: `
    <div class="absences-container">
      <h1>Calendrier des Absences</h1>
      <app-calendrier-absences></app-calendrier-absences>
    </div>
  `,
  styleUrls: ['./absences.component.css'],
})
export class AbsencesComponent {}
