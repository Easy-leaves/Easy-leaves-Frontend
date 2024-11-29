import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-carte-absence',
  standalone: true,
  imports: [],
  templateUrl: './carte-absence.component.html',
  styleUrl: './carte-absence.component.css'
})
export class CarteAbsenceComponent {
  @Input() utilisateur: { nom: string; image: string } = { nom: '', image: '' };
  @Input() type: string = '';
  @Input() dates: string = '';

  @Output() valider = new EventEmitter<void>();
  @Output() refuser = new EventEmitter<void>();

  onValider() {
    this.valider.emit();
  }

  onRefuser() {
    this.refuser.emit();
  }
}
