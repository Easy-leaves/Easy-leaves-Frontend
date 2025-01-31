import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbsenceModel } from '../../../ViewModels/AbsenceModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-delete-rtt-employeur',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-delete-rtt-employeur.component.html',
  styleUrl: './modal-delete-rtt-employeur.component.css'
})
export class ModalDeleteRttEmployeurComponent {
  @Input() isOpen: boolean = false;
  @Input() rttEmployeur: AbsenceModel | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<number>();

  onDelete() {
    if (this.rttEmployeur) {
      this.confirmDelete.emit(this.rttEmployeur.id);
    }
  }

  onClose() {
    this.close.emit();
  }
}
