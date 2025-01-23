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
  templateUrl:'./absences.component.html',
  styleUrls: ['./absences.component.css'],
})
export class AbsencesComponent {}
