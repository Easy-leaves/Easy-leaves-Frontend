import { Component, Inject } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbsencesService } from '../../services/absences/absences.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'app-edit-absence-dialog',
  templateUrl: './edit-absence-dialog.component.html',
})
export class EditAbsenceDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EditAbsenceDialogComponent>, // Référence au dialogue pour pouvoir le fermer
    @Inject(MAT_DIALOG_DATA) public data: { absence: any }, // Injection des données passées au composant (l'absence à modifier)
    private absencesService: AbsencesService // Service pour gérer les requêtes liées aux absences
  ) { }

  /**
   * Ferme le dialogue sans enregistrer les modifications.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }

  /**
   * Envoie les modifications de l'absence au backend et ferme le dialogue si la mise à jour réussit.
   */
  submitEdit(): void {
    console.log('Données envoyées :', this.data.absence);

    this.absencesService.updateAbsence(this.data.absence.id, this.data.absence).subscribe(
      (response) => {
        console.log('Absence mise à jour avec succès', response);
        this.dialogRef.close(true); // Ferme le modal et retourne "true" pour signaler une mise à jour réussie
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de l\'absence', error);
      }
    );

    // Ferme le dialogue et renvoie les nouvelles données de l'absence (même en cas d'échec)
    this.dialogRef.close(this.data.absence);
  }
}
