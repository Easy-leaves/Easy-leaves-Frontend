import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbsenceModel } from '../../../ViewModels/AbsenceModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Type } from '../../../../enums/Type';
import { Statut } from '../../../../enums/Statut';

@Component({
  selector: 'app-modal-update-rtt-employeur',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-update-rtt-employeur.component.html',
  styleUrl: './modal-update-rtt-employeur.component.css'
})
export class ModalUpdateRttEmployeurComponent {
  @Input() isOpen: boolean = false;
  @Input() rttEmployeur: AbsenceModel | null = null;
  @Input() errorMessage: string = '';
  @Input() existingRttDays: number = 0;
  @Output() close = new EventEmitter<void>();
  @Output() update = new EventEmitter<AbsenceModel>();



  onSave() {
    if (this.rttEmployeur) {
      const startDate = new Date(this.rttEmployeur.dateDebut);
      const endDate = new Date(this.rttEmployeur.dateFin);
  
      if (!this.rttEmployeur.motif.trim()) {
        this.errorMessage = "Le motif est obligatoire.";
        return;
      }
  
      if (endDate < startDate) {
        this.errorMessage = "La date de fin doit être supérieure ou égale à la date de début.";
        return;
      }
      
      // Vérification des jours de RTT hors week-ends
      let rttDays = this.calculateWorkingDays(startDate, endDate);
      if (this.existingRttDays + rttDays > 5) {
        this.errorMessage = "Le quota de 5 RTT employeurs par an est dépassé.";
        return;
      }
  
      this.errorMessage = '';
      this.update.emit(this.rttEmployeur);      
    }
  }

  calculateWorkingDays(startDate: Date, endDate: Date): number {
    let count = 0;
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
  }

  onClose() {
    this.close.emit();
  }
}
