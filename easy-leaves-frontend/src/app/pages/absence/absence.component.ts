import { Component, OnInit } from '@angular/core';
import { AbsenceService } from '../../services/absence.service';
import { AuthService } from '../../services/auth.service'; // Service pour l'authentification
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-absence',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './absence.component.html',
  styleUrls: ['./absence.component.css'],
})
export class AbsenceComponent implements OnInit {
  absences: any[] = []; // Liste des absences pour l'utilisateur authentifié
  newAbsence = {
    startDate: '',
    endDate: '',
    type: '',
    reason: '',
  };
  userId!: number; // ID de l'utilisateur authentifié

  constructor(private absenceService: AbsenceService, private authService: AuthService) { }

  ngOnInit(): void {

    // Récupérer l'utilisateur connecté
    this.userId = this.authService.getAuthenticatedUserId(); // Exemple d'appel au service d'auth
    this.loadAbsences();
    console.log('Authent', this.userId);
  }

  loadAbsences(): void {
    console.log('User ID:', this.userId); // Vérifiez si l'ID est défini
    this.absenceService.getAbsencesByUser(this.userId).subscribe(
      (data) => {
        console.log('Données récupérées:', data); // Log des données reçues
        this.absences = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des absences', error);
      }
    );
  }


  submitAbsence(): void {
    if (this.newAbsence.startDate && this.newAbsence.endDate && this.newAbsence.type) {
      const absenceToSubmit = {
        ...this.newAbsence,
        userId: this.userId, // Ajouter l'ID de l'utilisateur connecté
      };
      this.absenceService.createAbsence(absenceToSubmit).subscribe(
        () => {
          alert('Demande envoyée avec succès !');
          this.newAbsence = { startDate: '', endDate: '', type: '', reason: '' };
          this.loadAbsences();
        },
        (error) => {
          alert("Erreur lors de l'envoi de la demande");
        }
      );
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
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
