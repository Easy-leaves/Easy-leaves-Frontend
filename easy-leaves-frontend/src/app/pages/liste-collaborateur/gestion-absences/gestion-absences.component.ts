import { Component, OnInit } from '@angular/core';
import { CarteAbsenceComponent } from './carte-absence/carte-absence.component';
import { CommonModule } from '@angular/common';
import { Statut } from '../../../enums/Statut';
import {formatDate} from '@angular/common'

import { AbsencesService } from '../../../services/absences.service';
import { AbsenceView } from './ViewModels/AbsenceView';
import { AbsenceModel } from './ViewModels/AbsenceModel';



@Component({
  selector: 'app-gestion-absences',
  standalone: true,
  imports: [CommonModule, CarteAbsenceComponent],
  templateUrl: './gestion-absences.component.html',
  styleUrl: './gestion-absences.component.css'
})
export class GestionCongeComponent implements OnInit {
  constructor(private absencesServices: AbsencesService) {}
  
  absences: AbsenceView[] = [];
  
  ngOnInit(): void {
    this.absencesServices.getAbsencesByStatus(Statut.EN_ATTENTE_VALIDATION).subscribe(
      (data :AbsenceModel[]) => {
		console.log(data);
        this.absences = data.map((absence) => ({
          idAbsence: absence.id,
          dates: formatDate(absence.dateDebut, 'dd/MM/yyyy', 'fr-FR') + " - " + formatDate(absence.dateFin, 'dd/MM/yyy', 'fr-FR'),
          type: this.getAbsenceType(absence.type),
          statut: this.getAbsenceStatut(absence.statut),
          motif: absence.motif,
          utilisateur: {
			nom: '',
			image: '',
		  },
        })
		);
		console.log(this.absences);
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
  
  getAbsenceStatut(statut: string): string{
  const statutMapping: { [key: string]: string } = {
      'INITIALE': 'Demande en cours',
      'EN_ATTENTE_VALIDATION': 'En attente de validation',
      'REFUSEE': 'Refusée',
  	  'VALIDEE': 'Validée',
    };
    
    return statutMapping[statut] || 'Autre';
  }
  
  getAbsenceType(type: string): string{
  const typeMapping: { [key: string]: string } = {
      'RTT_EMPLOYEUR': 'RTT Employeur',
      'RTT_EMPLOYE': 'RTT Employé',
      'CONGE_PAYE': 'Congés payés',
  	  'CONGE_SANS_SOLDE': 'Congés sans soldes',
    };
    
    return typeMapping[type] || 'Autre';
  }
  
  // Actions de validation ou refus  
  onValider(absenceId: number): void {
    console.log("Absence Id : ", absenceId);
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
    this.absences = this.absences.filter((absence) => absence.idAbsence !== id);
  }

}
