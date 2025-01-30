import { Component, OnInit } from '@angular/core';
import { AbsenceService } from '../../services/absence.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'
import { EditAbsenceDialogComponent } from '../edit-absence-dialog/edit-absence-dialog.component';
import { Statut } from '../../enums/Statut';

@Component({
  selector: 'app-demande-absence',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './demande-absence.component.html',
  styleUrls: ['./demande-absence.component.css'],

})
export class DemandeAbsenceComponent implements OnInit {
  absences: any[] = []; // Liste des absences pour l'utilisateur authentifié
  newAbsence = {
    dateDebut: '',
    dateFin: '',
    type: '',
    motif: '',
  };
  userId: string | null = null;

  editing: boolean = false;
  currentAbsence: any = {};

  // Mapping des types d'absence
  private typeAbsenceMapping = {
    'Congé sans solde': 'CONGE_SANS_SOLDE',
    'Congé payé': 'CONGE_PAYE',
    'RTT employé': 'RTT_EMPLOYE',
    'RTT employeur': 'RTT_EMPLOYEUR',
    'Autre': 'AUTRE',
  } as const;

  constructor(private absenceService: AbsenceService, private dialog: MatDialog) { }

  openEditDialog(absence: any): void {
    const dialogRef = this.dialog.open(EditAbsenceDialogComponent, {
      width: '400px', // Vous pouvez ajuster la largeur ici
      height: 'auto', // Automatique ou définissez une hauteur
      data: { absence },
      panelClass: 'custom-dialog-container', // Classe personnalisée pour ajouter plus de styles
      position: {
        top: '50vh', // Centré verticalement
        left: '50vw', // Centré horizontalement
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAbsences();
      }
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('idUser'); // Charge l'ID utilisateur depuis localStorage
    if (this.userId) {
      this.loadAbsences();
    } else {
      console.error('Utilisateur non authentifié');
    }
  }

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

  editAbsence(absence: any) {
    this.editing = true;
    this.currentAbsence = { ...absence };
  }

  submitAbsence(): void {
    // Valider les données avant l'envoi
    if (!this.newAbsence.dateDebut || !this.newAbsence.dateFin || !this.newAbsence.type) {
      alert('Tous les champs obligatoires doivent être remplis.');
      return;
    }

    // Préparer les données à envoyer au backend
    // const requestData = {
    //   dateDebut: this.newAbsence.dateDebut,
    //   dateFin: this.newAbsence.dateFin,
    //   type: this.newAbsence.type,
    //   motif: this.newAbsence.motif,
    // };
    const requestData = {
      ...this.newAbsence,
      utilisateur: { idUtilisateur: Number(this.userId) }, // Convertit userId en nombre
    };

    this.absenceService.addAbsence(requestData).subscribe({
      next: (response) => {
        this.absences.push(response);
        this.newAbsence = { dateDebut: '', dateFin: '', type: '', motif: '' };
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de l\'absence:', err);
        alert('Une erreur est survenue lors de l\'ajout de l\'absence.');
      },
    });
  }


  deleteAbsence(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette absence ?')) {
      this.absenceService.deleteAbsence(id).subscribe(() => {
        alert('Absence supprimée avec succès.');
        this.loadAbsences();
      });
    }
  }
}
