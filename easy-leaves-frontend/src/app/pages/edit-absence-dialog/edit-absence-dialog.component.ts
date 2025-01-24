import { Component, Inject } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbsenceService } from '../../services/absence.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'app-edit-absence-dialog',
  templateUrl: './edit-absence-dialog.component.html',
})
export class EditAbsenceDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditAbsenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { absence: any },
    private absenceService: AbsenceService
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitEdit(): void {
    console.log('Données envoyées :', this.data.absence);
    this.absenceService.updateAbsence(this.data.absence.id, this.data.absence).subscribe(
      (response) => {
        console.log('Absence mise à jour avec succès', response);
        this.dialogRef.close(); // Ferme le modal après la mise à jour
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de l\'absence', error);
      }
    );

    this.dialogRef.close(this.data.absence); // Retourne les données modifiées
  }


}
