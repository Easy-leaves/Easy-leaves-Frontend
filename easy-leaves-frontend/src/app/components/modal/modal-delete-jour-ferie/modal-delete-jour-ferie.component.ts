import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { AbsenceModel } from '../../ViewModels/AbsenceModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-delete-jour-ferie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-delete-jour-ferie.component.html',
  styleUrl: './modal-delete-jour-ferie.component.css'
})
export class ModalDeleteJourFerieComponent {
  @Input() isOpen: boolean = false;
  @Input() holiday: AbsenceModel | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<number>();

  onDelete() {
    if (this.holiday) {
      this.confirmDelete.emit(this.holiday.id);
    }
  }

  onClose() {
    this.close.emit();
  }
}
