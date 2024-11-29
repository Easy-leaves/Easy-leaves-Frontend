import { Component, OnInit } from '@angular/core';
import { CarteAbsenceComponent } from './carte-absence/carte-absence.component';
import { CommonModule } from '@angular/common';
import { Statut } from '../../../enums/Statut';

import { AbsencesService } from '../../../services/absences.service';

@Component({
  selector: 'app-gestion-absences',
  standalone: true,
  imports: [CommonModule, CarteAbsenceComponent],
  templateUrl: './gestion-absences.component.html',
  styleUrl: './gestion-absences.component.css'
})
export class GestionCongeComponent implements OnInit {
  constructor(private absencesServices: AbsencesService) {}

  absences: any[] = [];
  
  ngOnInit(): void {
	// Charger les absences au statut "PENDING"
	    this.absencesServices.getAbsencesByStatus(Statut.EN_ATTENTE_VALIDATION.toString()).subscribe(
	      (data) => {
	        this.absences = data;
	      },
	      (error) => {
	        console.error('Erreur lors du chargement des absences :', error);
	      }
	    );
  }

  // Filtrer les absences par statut
  //getAbsencesFiltrees() {
   // return this.absences.filter(absence => absence.statut === this.statutFiltre);
  //}
  
  // Actions de validation ou refus  
  onValider(absenceId: number): void {

    this.absencesServices.validateAbsence(absenceId).subscribe(
      () => {
        console.log('Absence validée.');
        this.removeAbsenceFromList(absenceId);
      },
      (error) => {
        console.error('Erreur lors de la validation de l\'absence :', error);
      }
    );
  }

  onRefuser(absenceId: number): void {
    this.absencesServices.refuseAbsence(absenceId).subscribe(
      () => {
        console.log('Absence refusée.');
        this.removeAbsenceFromList(absenceId);
      },
      (error) => {
        console.error('Erreur lors du refus de l\'absence :', error);
      }
    );
  }

  // Supprimer une absence de la liste après une action
  private removeAbsenceFromList(id: number): void {
    this.absences = this.absences.filter((absence) => absence.id !== id);
  }

}
