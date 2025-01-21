import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AbsenceService } from '../../services/absence/absence.service';
import { Absence } from '../../model/absence';

@Component({
  selector: 'app-calendrier-absences',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './calendrier-absences.component.html',
  styleUrl: './calendrier-absences.component.css'
})
export class CalendrierAbsencesComponent {
  currentDate: Date = new Date(); // Date actuelle
  daysInMonth: number[] = []; // Tableau des jours du mois
  monthNames: string[] = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  selectedMonth: number = this.currentDate.getMonth(); // Mois actuel
  selectedYear: number = this.currentDate.getFullYear(); // Année actuelle
  absences: Absence[] = [];
  holidays: string[] = []; // Tableau des jours fériés

  constructor(
    private absenceService: AbsenceService,
  ) {}

  ngOnInit() {
    this.loadAbsences(21);
    this.generateDaysInMonth();
    
  }

  loadAbsences(userId: number) {
    this.absenceService.getAbsencesByUtilisateurId(userId).subscribe((absences) => {
      this.absences = absences;
    });
  }

  // Méthode pour formater les dates
  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  generateDaysInMonth() {
    const firstDayOfMonth = new Date(this.selectedYear, this.selectedMonth, 1);
    const lastDayOfMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0);
    const daysInMonth = [];

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      daysInMonth.push(i);
    }

    this.daysInMonth = daysInMonth;
  }

  hasAbsence(day: number): boolean {
    const dateKey = new Date(this.selectedYear, this.selectedMonth, day);
  
    // Ignore le temps (heure, minute, etc.) pour la comparaison
    dateKey.setHours(0, 0, 0, 0);
  
    return this.absences.some((absence) => {
      const startDate = new Date(absence.dateDebut);
      const endDate = new Date(absence.dateFin);
  
      // Ignore les heures pour les deux bornes
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
  
      return dateKey >= startDate && dateKey <= endDate;
    });
  }

  changeMonth(offset: number) {
    this.selectedMonth += offset;
    if (this.selectedMonth < 0) {
      this.selectedMonth = 11;
      this.selectedYear--;
    } else if (this.selectedMonth > 11) {
      this.selectedMonth = 0;
      this.selectedYear++;
    }
    this.generateDaysInMonth();
  }

  chunk(arr: number[], size: number): number[][] {
    const result: number[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  isHoliday(day: number): boolean {
    const dateKey = `${this.selectedYear}-${this.selectedMonth + 1}-${day}`;
    return this.holidays.includes(dateKey);
  }
}
