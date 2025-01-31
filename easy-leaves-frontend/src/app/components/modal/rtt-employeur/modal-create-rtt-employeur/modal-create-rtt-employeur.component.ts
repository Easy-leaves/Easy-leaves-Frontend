import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Statut } from '../../../../enums/Statut';
import { Type } from '../../../../enums/Type';
import { AbsenceModel } from '../../../ViewModels/AbsenceModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbsenceView } from '../../../ViewModels/AbsenceView';

@Component({
  selector: 'app-modal-create-rtt-employeur',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-create-rtt-employeur.component.html',
  styleUrl: './modal-create-rtt-employeur.component.css'
})
export class ModalCreateRttEmployeurComponent {
  @Input() isOpen: boolean = false;
  @Input() errorMessage: string = '';
  @Input() rttList: AbsenceModel[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<AbsenceModel>();

  newRttEmployeur: AbsenceModel = {
    id: 0,
    dateDebut: new Date(),
    dateFin: new Date(),
    type: Type.RTT_EMPLOYEUR,
    motif: '',
    statut: Statut.VALIDEE,
    utilisateurNom: ''
  };

  /**
   * Calcule le total des jours RTT employeurs existants pour l'année du nouveau RTT
   */
  getTotalRttDaysForYear(year: number): number {
    return this.rttList
      .filter(rtt => new Date(rtt.dateDebut).getFullYear() === year)
      .reduce((sum, rtt) => sum + this.calculerNombreJours(rtt.dateDebut, rtt.dateFin), 0);
  }

  /**
   * Calcule le nombre de jours entre deux dates
   */
  calculerNombreJours(dateDebut: Date, dateFin: Date): number {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    return (fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24) + 1;
  }

  private countBusinessDays(startDate: Date, endDate: Date): number {
    let count = 0;
    let currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay(); // 0 = dimanche, 6 = samedi
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++; // Ne compter que les jours ouvrés (lundi à vendredi)
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return count;
  }

  onSave() {
    const today = new Date();
    const startDate = new Date(this.newRttEmployeur.dateDebut);
    const endDate = new Date(this.newRttEmployeur.dateFin);
  
    if (!this.newRttEmployeur.motif.trim()) {
      this.errorMessage = "Le motif est obligatoire.";
      return;
    }
  
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      this.errorMessage = "Les dates sélectionnées sont invalides.";
      return;
    }
  
    if (startDate <= today) {
      this.errorMessage = "La date de début doit être supérieure à la date actuelle.";
      return;
    }
  
    if (endDate < startDate) {
      this.errorMessage = "La date de fin doit être supérieure ou égale à la date de début.";
      return;
    }
  
    // Récupérer l'année du RTT à ajouter
    const rttYear = startDate.getFullYear();
  
    // Calculer les jours ouvrés du RTT en cours d'ajout
    const newRttDays = this.countBusinessDays(startDate, endDate);
  
    // Calculer les jours ouvrés de RTT déjà posés cette année
    const totalRttDays = this.rttList
      .filter(rtt => new Date(rtt.dateDebut).getFullYear() === rttYear) // Filtrer sur l'année
      .reduce((total, rtt) => total + this.countBusinessDays(new Date(rtt.dateDebut), new Date(rtt.dateFin)), 0);
  
    if (totalRttDays + newRttDays > 5) {
      this.errorMessage = "Le quota de 5 RTT employeurs par an est dépassé.";
      return;
    }
  
    // Réinitialiser l'erreur et sauvegarder
    this.errorMessage = '';
    this.save.emit(this.newRttEmployeur);
  }

  onClose() {
    this.close.emit();
  }
}