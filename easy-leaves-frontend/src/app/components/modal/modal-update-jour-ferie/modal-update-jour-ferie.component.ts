import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbsenceModel } from '../../ViewModels/AbsenceModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-update-jour-ferie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-update-jour-ferie.component.html',
  styleUrl: './modal-update-jour-ferie.component.css'
})
export class ModalUpdateJourFerieComponent {
  @Input() holiday: AbsenceModel | null = null;
  @Input() isOpen: boolean = false;
  @Input() errorMessage: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<AbsenceModel>();

  onSave() {
    if (this.holiday) {
      this.save.emit(this.holiday);
    }
  }

  onClose() {
    this.close.emit();
  }
}
