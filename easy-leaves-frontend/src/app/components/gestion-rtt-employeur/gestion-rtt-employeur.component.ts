import { Component } from '@angular/core';
import { AbsenceView } from '../ViewModels/AbsenceView';
import { AbsenceModel } from '../ViewModels/AbsenceModel';
import { Type } from '../../enums/Type';
import { Statut } from '../../enums/Statut';
import { CommonModule, formatDate } from '@angular/common';
import { AbsencesService } from '../../services/absences.service';
import { ModalCreateRttEmployeurComponent } from '../modal/rtt-employeur/modal-create-rtt-employeur/modal-create-rtt-employeur.component';
import { ModalDeleteRttEmployeurComponent } from '../modal/rtt-employeur/modal-delete-rtt-employeur/modal-delete-rtt-employeur.component';
import { ModalUpdateRttEmployeurComponent } from '../modal/rtt-employeur/modal-update-rtt-employeur/modal-update-rtt-employeur.component';

@Component({
  selector: 'app-gestion-rtt-employeur',
  standalone: true,
  imports: [CommonModule, ModalCreateRttEmployeurComponent, ModalDeleteRttEmployeurComponent, ModalUpdateRttEmployeurComponent],
  templateUrl: './gestion-rtt-employeur.component.html',
  styleUrl: './gestion-rtt-employeur.component.css'
})
export class GestionRttEmployeurComponent {
  rttEmployeurs: AbsenceModel[] = [];
  rttEmployeursView: AbsenceView[] = [];
  isDeleteModalOpen = false;
  isEditModalOpen = false;
  isAddModalOpen = false;
  modalErrorMessage: string = '';
  successMessage: string = '';
  currentRttEmployeur: AbsenceModel = {
    id: 0,
    dateDebut: new Date(),
    dateFin: new Date(),
    type: Type.RTT_EMPLOYEUR,
    motif: '',
    statut: Statut.VALIDEE,
    utilisateurNom: ''
  };

  constructor(private absencesService: AbsencesService) {}
  
  /**
   * Initialisation du composant
   */
  ngOnInit(): void {
    this.fetchRttEmployeur();
  }

  /**
   * Récupère la liste des jours fériés depuis le backend.
   * Transforme les données brutes en format lisible par l'utilisateur et les stocke dans `holidays`.
   */
  fetchRttEmployeur() {
    this.absencesService.getAbsencesByType(Type.RTT_EMPLOYEUR).subscribe(
      (data: AbsenceModel[]) => {
        this.rttEmployeurs = data.map((rttEmployeur) => ({
          id: rttEmployeur.id,
          dateDebut: rttEmployeur.dateDebut,
          dateFin: rttEmployeur.dateFin,
          type: this.getAbsenceType(rttEmployeur.type),
          statut: this.getAbsenceStatut(rttEmployeur.statut),
          motif: rttEmployeur.motif,
          utilisateurNom: rttEmployeur.utilisateurNom,
        }));
        this.rttEmployeursView = data.map((rttEmployeur) => ({
          idAbsence: rttEmployeur.id,
          dates: formatDate(rttEmployeur.dateDebut, 'dd/MM/yyyy', 'fr-FR') + '-' + formatDate(rttEmployeur.dateFin, 'dd/MM/yyyy', 'fr-FR'),
          type: this.getAbsenceType(rttEmployeur.type),
          statut: this.getAbsenceStatut(rttEmployeur.statut),
          motif: rttEmployeur.motif,
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
   * Ouvre le modal d'édition pour un RTT Employeur.
   * @param rttEmployeur - Les données du RTT Employeur à modifier.
   */
  openEditModal(rttEmployeur: AbsenceView) {
    if (!rttEmployeur) {
      this.handleError('Données du RTT Employeur introuvables.');
      return;
    }

    this.currentRttEmployeur = {
      id: rttEmployeur.idAbsence,
      dateDebut: new Date(rttEmployeur.dates.split(' - ')[0]),
      dateFin: new Date(rttEmployeur.dates.split(' - ')[1]),
      utilisateurNom: '',
      motif: rttEmployeur.motif,
      statut: (Object.values(Statut).includes(rttEmployeur.statut as Statut) ? rttEmployeur.statut : Statut.VALIDEE) as Statut,
      type: (Object.values(Type).includes(rttEmployeur.type as Type) ? rttEmployeur.type : Type.RTT_EMPLOYEUR) as Type,
    };
  
    this.isEditModalOpen = true;
  }

  /**
   * Ouvre le modal de suppression pour un RTT Employeur.
   * @param rttEmployeur - Les données du RTT Employeur à supprimer.
   */
  openDeleteModal(rttEmployeur: AbsenceView) {
    if (!rttEmployeur) {
      this.handleError('Données de RTT Employeur introuvables.');
      return;
    }

    this.currentRttEmployeur = {
      id: rttEmployeur.idAbsence,
      dateDebut: new Date(rttEmployeur.dates.split(' - ')[0]),
      dateFin: new Date(rttEmployeur.dates.split(' - ')[1]),
      utilisateurNom: '',
      motif: rttEmployeur.motif,
      statut: (Object.values(Statut).includes(rttEmployeur.statut as Statut) ? rttEmployeur.statut : Statut.VALIDEE) as Statut,
      type: (Object.values(Type).includes(rttEmployeur.type as Type) ? rttEmployeur.type : Type.RTT_EMPLOYEUR) as Type,
    };

    this.isDeleteModalOpen = true;
  }
  
  /**
  * Ouvre le modal d'ajout d'un nouveau RTT Employeur.
  * Réinitialise le formulaire d'ajout.
  */
  openAddModal() {
    this.isAddModalOpen = true;
    this.modalErrorMessage = '';
  }  

  /**
  * Ouvre le modal d'édition pour un RTT Employeur.
  * @param holiday - Les données du RTT Employeur à modifier.
  */
  submitEdit(rttEmployeur: AbsenceModel){
    this.absencesService.updateRTTEmployeur(rttEmployeur).subscribe(
      (response) => {
        this.rttEmployeurs = this.rttEmployeurs.map((rttEmployeur) => ({
          id: rttEmployeur.id,
          dateDebut: rttEmployeur.dateDebut,
          dateFin: rttEmployeur.dateFin,
          type: this.getAbsenceType(rttEmployeur.type),
          statut: this.getAbsenceStatut(rttEmployeur.statut),
          motif: rttEmployeur.motif,
          utilisateurNom: rttEmployeur.utilisateurNom,
        }));
        this.rttEmployeursView = this.rttEmployeurs.map((rttEmployeur) => ({
          idAbsence: rttEmployeur.id,
          dates: formatDate(rttEmployeur.dateDebut, 'dd/MM/yyyy', 'fr-FR') + '-' + formatDate(rttEmployeur.dateFin, 'dd/MM/yyyy', 'fr-FR'),
          type: this.getAbsenceType(rttEmployeur.type),
          statut: this.getAbsenceStatut(rttEmployeur.statut),
          motif: rttEmployeur.motif,
          nom: '',
        }));
        this.handleSuccess('Jour férié modifié avec succès.');

        this.closeModal();
      },
      (error) => {
        this.handleError("Erreur lors de la modification du jour férié.");
      }
  );
  }

  /**
  * Valide et ajoute un nouveau RTT Employeur.
  * Envoie les données au backend et met à jour la liste locale.
  */
  submitAdd(rttEmployeur: AbsenceModel){
    this.absencesService.addRTTEmployeur(rttEmployeur).subscribe(() => {
      this.fetchRttEmployeur();
    });
  }

  /**
  * Supprime un rtt employeur sélectionné.
  * Met à jour la liste locale après suppression dans le backend.
  */
  submitDelete(id: number){
    this.absencesService.deleteAbsence(id).subscribe(
      (response) => {
        this.rttEmployeurs = this.rttEmployeurs.filter((rtt) => rtt.id !== id);
        this.rttEmployeursView = this.rttEmployeursView.filter((rtt) => rtt.idAbsence !== id);

        this.handleSuccess('Jour férié supprimé avec succès.');
        this.closeModal();
      },
      (error) => {
        this.handleError("Erreur lors de la suppression du jour férié.");
      })
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