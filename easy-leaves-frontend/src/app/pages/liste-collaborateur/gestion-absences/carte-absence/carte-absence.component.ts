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
  @Input() idAbsence!: number;

  @Output() valider = new EventEmitter<number>();
  @Output() refuser = new EventEmitter<number>();

  onValider() {
	console.log("Carte absence Id : " + this.idAbsence);
    this.valider.emit(this.idAbsence);
  }

  onRefuser() {
    this.refuser.emit(this.idAbsence);
  }
}
