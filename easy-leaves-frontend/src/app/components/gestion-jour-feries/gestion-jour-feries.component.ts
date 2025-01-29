import { Component } from '@angular/core';
import { AbsencesService } from '../../services/absences.service';
import { AbsenceModel } from '../ViewModels/AbsenceModel';
import { CommonModule, formatDate } from '@angular/common';
import { AbsenceView } from '../ViewModels/AbsenceView';
import { Type } from '../../enums/Type';
import { Absence } from '../../model/absence';
import { FormsModule } from '@angular/forms';
import { Statut } from '../../enums/Statut';
import { ModalAddJourFerieComponent } from '../modal/modal-add-jour-ferie/modal-add-jour-ferie.component';
import { ModalDeleteJourFerieComponent } from '../modal/modal-delete-jour-ferie/modal-delete-jour-ferie.component';
import { ModalUpdateJourFerieComponent } from "../modal/modal-update-jour-ferie/modal-update-jour-ferie.component";
import { ModalAddJourFerieComponent } from '../modal/modal-create-jour-ferie/modal-add-jour-ferie.component';
import { ModalDeleteJourFerieComponent } from '../modal/modal-delete-jour-ferie/modal-delete-jour-ferie.component';
import { ModalUpdateJourFerieComponent } from "../modal/modal-update-jour-ferie/modal-update-jour-ferie.component";

@Component({
  selector: 'app-gestion-jour-feries',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalAddJourFerieComponent, ModalDeleteJourFerieComponent, ModalDeleteJourFerieComponent, ModalUpdateJourFerieComponent],
  templateUrl: './gestion-jour-feries.component.html',
  styleUrl: './gestion-jour-feries.component.css'
})
export class GestionJourFeriesComponent {
  holidays: AbsenceView[] = [];
  isDeleteModalOpen = false;
  isEditModalOpen = false;
  isAddModalOpen = false;
  modalErrorMessage: string = '';
  successMessage: string = '';
  currentHoliday: AbsenceModel = {
    id: 0,
    dateDebut: new Date(),
    dateFin: new Date(),
    type: Type.FERIE,
    motif: '',
    statut: Statut.VALIDEE,
    utilisateurNom: ''
  };

  constructor(private absencesService: AbsencesService) {}

  /**
   * Initialisation du composant
   */
  ngOnInit(): void {
    this.fetchJourFerie();
  }

  /**
   * Récupère la liste des jours fériés depuis le backend.
   * Transforme les données brutes en format lisible par l'utilisateur et les stocke dans `holidays`.
   */
  fetchJourFerie() {
    this.absencesService.getAbsencesByType(Type.FERIE).subscribe(
      (data:AbsenceModel[]) => {
        this.holidays = data.map((holiday) => ({
          idAbsence: holiday.id,
          dates: formatDate(holiday.dateDebut, 'dd/MM/yyyy', 'fr-FR'),
          type: this.getAbsenceType(holiday.type),
          statut: this.getAbsenceStatut(holiday.statut),
          motif: holiday.motif,
          nom: '',
        }));
      },
      (error) => {
        this.handleError("Erreur lors du chargement des absences.");
      }
    );
  }

  /**
   * Retourne un libellé lisible pour l'utilisateur en fonction du statut d'une absence.
   * @param statut - Le statut de l'absence.
   * @returns Libellé lisible du statut.
   */
  getAbsenceStatut(statut: string): string{
    const statutMapping: { [key: string]: string } = {
        'INITIALE': 'Demande en cours',
        'EN_ATTENTE_VALIDATION': 'En attente de validation',
        'REFUSEE': 'Refusée',
        'VALIDEE': 'Validée',
      };
      
      return statutMapping[statut] || 'Autre';
    }
    
  /**
   * Retourne un libellé lisible pour l'utilisateur en fonction du type d'une absence.
   * @param type - Le type de l'absence.
   * @returns Libellé lisible du type.
   */
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

  /**
   * Valide et soumet les modifications d'un jour férié.
   * Met à jour l'entrée correspondante dans le backend et localement.
   */
  submitEdit(holiday: AbsenceModel) {
    // Vérifiez que les données de `currentHoliday` sont valides
    if (!this.currentHoliday) {
      this.handleError("Les données de modification sont invalides.");
      return;
    }

    const today = new Date();
    const startDate = new Date(this.currentHoliday.dateDebut);

    // Vérification si la date de début est remplit
    if (isNaN(startDate.getTime())) {
      this.handleError("La date de début est invalide. Veuillez entrer une date correcte.");
      return;
    }

    // Vérification si la date de début est suppérieur à la date du jour
    if (startDate <= today) {
      this.handleError("La date de début des jours fériés doit être strictement supérieure à la date actuelle.");
      return;
    }

    // Préparez les données à envoyer au backend
    const updatedHoliday: AbsenceModel = {
      id: holiday.id,
      dateDebut: holiday.dateDebut,
      dateFin: holiday.dateDebut,
      type: holiday.type,
      statut: holiday.statut,
      motif: holiday.motif,
      utilisateurNom: ''
    };

    this.absencesService.updateHoliday(updatedHoliday).subscribe(
        (response) => {
          this.holidays = this.holidays.map(holiday =>
            holiday.idAbsence === this.currentHoliday.id ? { ...holiday, 
              dates: formatDate(this.currentHoliday.dateDebut, 'dd/MM/yyyy', 'fr-FR'),
              motif: this.currentHoliday.motif
            } : holiday
          );

          this.handleSuccess('Jour férié modifié avec succès.');

          this.closeModal();
        },
        (error) => {
          this.handleError("Erreur lors de la modification du jour férié.");
        }
    );
  }

  /**
   * Valide et ajoute un nouveau jour férié.
   * Envoie les données au backend et met à jour la liste locale.
   */
  submitAdd(newHoliday: AbsenceModel) {
    const startDate = new Date(newHoliday.dateDebut);
  
    // Vérification de la validité de la date
    if (isNaN(startDate.getTime())) {
      this.handleError("La date de début est invalide. Veuillez entrer une date correcte.");
      return;
    }
  
    // Vérification si la date de début est supérieure à aujourd'hui
    const today = new Date();
    if (startDate <= today) {
      this.handleError("La date de début des jours fériés doit être strictement supérieure à la date actuelle.");
      return;
    }
  
    // Vérification si un motif est fourni
    if (!newHoliday.motif || newHoliday.motif.trim() === '') {
      this.handleError("Le motif du jour férié est obligatoire.");
      return;
    }
  
    // Préparer les données pour l'ajout
    const holidayToAdd: AbsenceModel = {
      id: 0,
      dateDebut: newHoliday.dateDebut,
      dateFin: newHoliday.dateDebut,
      type: Type.FERIE,
      statut: Statut.VALIDEE,
      motif: newHoliday.motif,
      utilisateurNom: '',
    };
  
    this.absencesService.addHoliday(holidayToAdd).subscribe(
      (response) => {
  
        this.closeModal();
        this.handleSuccess('Jour férié ajouté avec succès');
        // On recharge pour récupérer le jour férié avec l'id
        this.fetchJourFerie()
      },
      (error) => {
        this.handleError("Erreur lors de l'ajout du jour férié. Veuillez réessayer.");
      }
    );
  }  

  /**
   * Ouvre le modal d'édition pour un jour férié.
   * @param holiday - Les données du jour férié à modifier.
   */
  openEditModal(holiday: AbsenceView) {
    if (!holiday) {
      this.handleError('Données de jour férié introuvables.');
      return;
    }

    this.currentHoliday = {
      id: holiday.idAbsence,
      dateDebut: new Date(holiday.dates.split(' - ')[0]),
      dateFin: new Date(holiday.dates.split(' - ')[1]),
      utilisateurNom: '',
      motif: holiday.motif,
      statut: (Object.values(Statut).includes(holiday.statut as Statut) ? holiday.statut : Statut.VALIDEE) as Statut,
      type: (Object.values(Type).includes(holiday.type as Type) ? holiday.type : Type.FERIE) as Type,
    };
  
    this.isEditModalOpen = true;
  }

  /**
   * Ouvre le modal de suppression pour un jour férié.
   * @param holiday - Les données du jour férié à supprimer.
   */
  openDeleteModal(holiday: AbsenceView) {
    if (!holiday) {
      this.handleError('Données de jour férié introuvables.');
      return;
    }

    this.currentHoliday = {
      id: holiday.idAbsence,
      dateDebut: new Date(holiday.dates.split(' - ')[0]),
      dateFin: new Date(holiday.dates.split(' - ')[0]),
      utilisateurNom: '',
      motif: holiday.motif,
      statut: (Object.values(Statut).includes(holiday.statut as Statut) ? holiday.statut : Statut.VALIDEE) as Statut,
      type: (Object.values(Type).includes(holiday.type as Type) ? holiday.type : Type.FERIE) as Type,
    };

    this.isDeleteModalOpen = true;
  }

  /**
   * Ouvre le modal d'ajout d'un nouveau jour férié.
   * Réinitialise le formulaire d'ajout.
   */
  openAddModal() {
    this.isAddModalOpen = true;
    this.modalErrorMessage = '';
  }  

  /**
   * Ferme tous les modals ouverts (ajout, édition, suppression).
   * Réinitialise les champs et les messages d'erreur.
   */
  closeModal() {
    this.isDeleteModalOpen = false;
    this.isEditModalOpen = false;
    this.isAddModalOpen = false;
    this.modalErrorMessage = '';
  }

  /**
   * Supprime un jour férié sélectionné.
   * Met à jour la liste locale après suppression dans le backend.
   */
  submitDelete(holidayId: number): void {
    this.absencesService.deleteAbsence(holidayId).subscribe(
      (response) => {
        this.holidays = this.holidays.filter((holiday) => holiday.idAbsence !== holidayId);

        this.handleSuccess('Jour férié supprimé avec succès.');
        this.closeModal();
      },
      (error) => {
        this.handleError("Erreur lors de la suppression du jour férié.");
      }
    );
  }

  /**
   * Gère et affiche un message d'erreur.
   * @param message - Le message d'erreur à afficher.
   */
  handleError(message: string): void {
    this.modalErrorMessage = message;
  }

  /**
   * Gère et affiche un message de succès.
   * Efface automatiquement le message après 5 secondes.
   * @param message - Le message de succès à afficher.
   */
  handleSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => (this.successMessage = ''), 5000);
  }
}