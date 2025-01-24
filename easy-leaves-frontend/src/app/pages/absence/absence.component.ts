import { Component, OnInit } from '@angular/core';
import { AbsenceService } from '../../services/absence.service';
import { AuthService } from '../../services/auth.service'; // Service pour l'authentification
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditAbsenceDialogComponent } from '../edit-absence-dialog/edit-absence-dialog.component';

@Component({
  selector: 'app-absence',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './absence.component.html',
  styleUrls: ['./absence.component.css'],

})
export class AbsenceComponent implements OnInit {
  absences: any[] = []; // Liste des absences pour l'utilisateur authentifié
  newAbsence = {
    dateDebut: '',
    dateFin: '',
    type: '',
    motif: '',

  };
  userId!: number; // ID de l'utilisateur authentifié

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

  constructor(private absenceService: AbsenceService, private authService: AuthService, private dialog: MatDialog) { }

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
    this.userId = this.authService.getAuthenticatedUserId(); // Exemple d'appel au service d'auth
    this.loadAbsences();
    console.log('Authent', this.userId);
  }

  loadAbsences(): void {
    console.log('User ID:', this.userId);
    this.absenceService.getAbsencesByUser(this.userId).subscribe(
      (data) => {
        console.log('Données récupérées:', data);
        this.absences = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des absences', error);
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

    // Mapper le type d'absence en utilisant le mapping
    const mappedType = this.typeAbsenceMapping[this.newAbsence.type as keyof typeof this.typeAbsenceMapping];
    if (!mappedType) {
      alert('Type d\'absence invalide.');
      return;
    }

    // Préparer les données à envoyer au backend
    const requestData = {
      dateDebut: this.newAbsence.dateDebut,
      dateFin: this.newAbsence.dateFin,
      type: mappedType,
      motif: this.newAbsence.motif,
    };

    // Appel au service pour ajouter une absence
    this.absenceService.addAbsence(requestData).subscribe({
      next: (response) => {
        console.log('Absence ajoutée avec succès :', response);
        this.absences.push(response); // Met à jour la liste localement
        this.newAbsence = { dateDebut: '', dateFin: '', type: '', motif: '' }; // Réinitialise le formulaire
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de l\'absence :', err);
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
