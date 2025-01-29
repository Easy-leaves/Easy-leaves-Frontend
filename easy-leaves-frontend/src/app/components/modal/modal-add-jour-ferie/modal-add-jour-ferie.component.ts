import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Statut } from '../../../enums/Statut';
import { AbsenceModel } from '../../ViewModels/AbsenceModel';
import { Type } from '../../../enums/Type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-add-jour-ferie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-add-jour-ferie.component.html',
  styleUrl: './modal-add-jour-ferie.component.css'
})
export class ModalAddJourFerieComponent {
  @Input() isOpen: boolean = false;
  @Input() errorMessage: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<AbsenceModel>();

  newHoliday: AbsenceModel = {
    id: 0,
    dateDebut: new Date(),
    dateFin: new Date(),
    type: Type.FERIE,
    motif: '',
    statut: Statut.VALIDEE,
    utilisateurNom: ''
  };

  onSave() {
    const today = new Date();
    const startDate = new Date(this.newHoliday.dateDebut);

    if (isNaN(startDate.getTime())) {
      this.errorMessage = "La date de début est invalide.";
      return;
    }

    if (startDate <= today) {
      this.errorMessage = "La date de début doit être supérieure à la date actuelle.";
      return;
    }

    if (!this.newHoliday.motif.trim()) {
      this.errorMessage = "Le motif est obligatoire.";
      return;
    }

    this.save.emit(this.newHoliday);
  }

  onClose() {
    this.close.emit();
  }
}
