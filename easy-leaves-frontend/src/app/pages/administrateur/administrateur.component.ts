import { Component } from '@angular/core';
import { GestionJourFeriesComponent } from '../../components/gestion-jour-feries/gestion-jour-feries.component';

@Component({
  selector: 'app-administrateur',
  standalone: true,
  imports: [GestionJourFeriesComponent],
  templateUrl: './administrateur.component.html',
  styleUrl: './administrateur.component.css'
})
export class AdministrateurComponent {

}
