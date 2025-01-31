import { Component, OnInit } from '@angular/core';
import { AbsenceService } from '../../services/absence.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'
import { EditAbsenceDialogComponent } from '../edit-absence-dialog/edit-absence-dialog.component';

@Component({
  selector: 'app-demande-absence',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './demande-absence.component.html',
  styleUrls: ['./demande-absence.component.css'],
})
export class DemandeAbsenceComponent implements OnInit {
  // Liste des absences pour l'utilisateur authentifié
  absences: any[] = [];

  // Objet représentant une nouvelle absence à créer
  newAbsence = {
    dateDebut: '',
    dateFin: '',
    type: '',
    motif: '',
  };

  // ID de l'utilisateur authentifié
  userId: string | null = null;

  // Indique si une absence est en cours d'édition
  editing: boolean = false;

  // Contient les données de l'absence en cours d'édition
  currentAbsence: any = {};

  constructor(private absenceService: AbsenceService, private dialog: MatDialog) { }

  /**
   * Ouvre une boîte de dialogue pour modifier une absence
   * @param absence L'absence à modifier
   */
  openEditDialog(absence: any): void {
    const dialogRef = this.dialog.open(EditAbsenceDialogComponent, {
      width: '400px',
      height: 'auto',
      data: { absence },
      position: {
        top: '50vh', // Centré verticalement
        left: '50vw', // Centré horizontalement
      },
    });

    // Après la fermeture du dialog, recharge la liste des absences si une mise à jour a été faite
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAbsences();
      }
    });
  }

  /**
   * Méthode appelée lors de l'initialisation du composant
   */
  ngOnInit(): void {
    this.userId = localStorage.getItem('idUser'); // Charge l'ID utilisateur depuis localStorage
    if (this.userId) {
      this.loadAbsences(); // Charge la liste des absences de l'utilisateur
    } else {
      console.error('Utilisateur non authentifié');
    }
  }

  /**
   * Charge la liste des absences de l'utilisateur depuis le backend
   */
  loadAbsences(): void {
    this.absenceService.getAbsencesByUser().subscribe(
      (data) => {
        this.absences = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des absences:', error);
      }
    );
  }

  /**
   * Active le mode édition pour une absence spécifique
   * @param absence L'absence à éditer
   */
  editAbsence(absence: any) {
    this.editing = true;
    this.currentAbsence = { ...absence };
  }

  /**
   * Soumet une nouvelle demande d'absence
   */
  submitAbsence(): void {
    // Vérifie si tous les champs obligatoires sont remplis
    if (!this.newAbsence.dateDebut || !this.newAbsence.dateFin || !this.newAbsence.type) {
      alert('Tous les champs obligatoires doivent être remplis.');
      return;
    }

    // Prépare les données à envoyer au backend
    const requestData = {
      ...this.newAbsence,
      utilisateur: { idUtilisateur: Number(this.userId) }, // Convertit userId en nombre
    };

    // Envoie la demande d'absence au backend
    this.absenceService.addAbsence(requestData).subscribe({
      next: () => {
        this.newAbsence = { dateDebut: '', dateFin: '', type: '', motif: '' }; // Réinitialise le formulaire
        this.loadAbsences(); // Recharge les absences après ajout
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de l\'absence:', err);
        alert('Une erreur est survenue lors de l\'ajout de l\'absence.');
      },
    });
  }

  /**
   * Supprime une absence après confirmation
   * @param id L'ID de l'absence à supprimer
   */
  deleteAbsence(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette absence ?')) {
      this.absenceService.deleteAbsence(id).subscribe(() => {
        alert('Absence supprimée avec succès.');
        this.loadAbsences(); // Recharge la liste après suppression
      });
    }
  }
}
