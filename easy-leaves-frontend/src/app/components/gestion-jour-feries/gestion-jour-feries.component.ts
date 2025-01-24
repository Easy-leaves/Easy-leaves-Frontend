import { Component } from '@angular/core';
import { AbsencesService } from '../../services/absences.service';
import { AbsenceModel } from '../ViewModels/AbsenceModel';
import { CommonModule, formatDate } from '@angular/common';
import { AbsenceView } from '../ViewModels/AbsenceView';
import { Type } from '../../enums/Type';
import { Absence } from '../../model/absence';
import { FormsModule } from '@angular/forms';
import { Statut } from '../../enums/Statut';

@Component({
  selector: 'app-gestion-jour-feries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-jour-feries.component.html',
  styleUrl: './gestion-jour-feries.component.css'
})
export class GestionJourFeriesComponent {
  holidays: AbsenceView[] = [];
  isDeleteModalOpen = false;
  isEditModalOpen = false;
  currentHoliday: Absence = {
    id: 0,
    dateDebut: new Date(),
    dateFin: new Date(),
    type: Type.FERIE,
    motif: '',
    statut: Statut.VALIDEE,
    utilisateurId: 0
  };

  constructor(private absencesService: AbsencesService) {}

  ngOnInit(): void {
    this.fetchJourFerie();
  }

  fetchJourFerie() {
    this.absencesService.getAbsencesByType(Type.FERIE).subscribe(
      (data:AbsenceModel[]) => {
        this.holidays = data.map((holiday) => ({
          idAbsence: holiday.id,
          dates: formatDate(holiday.dateDebut, 'dd/MM/yyyy', 'fr-FR') + " - " + formatDate(holiday.dateFin, 'dd/MM/yyy', 'fr-FR'),
          type: this.getAbsenceType(holiday.type),
          statut: this.getAbsenceStatut(holiday.statut),
          motif: holiday.motif,
          nom: '',
        }));
      },
      (error) => {
        console.error('Erreur lors du chargement des absences :', error);
      }
    );
  }

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
        'FERIE': 'Jour férié'
      };
      
      return typeMapping[type] || 'Autre';
    }

    editHoliday(idAbsence: number) {

    }

    deleteHoliday(idAbsence: number) {

    }

    openEditModal(holiday: AbsenceView) {
      // Vérifiez que les données sont valides avant de les utiliser
      if (!holiday) {
        console.error('Données introuvables');
        return;
      }

      this.currentHoliday = {
        id: holiday.idAbsence,
        dateDebut: new Date(holiday.dates),
        dateFin: new Date(holiday.dates),
        utilisateurId: 0,
        motif: holiday.motif,
        statut: holiday.statut,
        type: holiday.type,
      };
      this.isEditModalOpen = true;
    }

    openDeleteModal(holiday: AbsenceView) {
      if (!holiday) {
        console.error('Données introuvables');
        return;
      }

      this.currentHoliday = {
        id: holiday.idAbsence,
        dateDebut: new Date(holiday.dates),
        dateFin: new Date(holiday.dates),
        utilisateurId: 0,
        motif: holiday.motif,
        statut: holiday.statut,
        type: holiday.type,
      };
      this.isDeleteModalOpen = true;
    }

    closeModal() {
      this.isDeleteModalOpen = false;
      this.isEditModalOpen = false
      this.currentHoliday = {
        id: 0,
        dateDebut: new Date(),
        dateFin: new Date(),
        type: Type.FERIE,
        motif: '',
        statut: Statut.VALIDEE,
        utilisateurId: 0
      };
    }

    submitDelete() {
      this.closeModal();
    }

    submitEdit(){
      this.closeModal();
    }
}
