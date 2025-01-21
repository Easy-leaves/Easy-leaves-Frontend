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
  daysInMonth: (number | null)[] = []; // Tableau des jours du mois
  monthNames: string[] = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  selectedMonth: number = this.currentDate.getMonth(); // Mois actuel
  selectedYear: number = this.currentDate.getFullYear(); // Année actuelle
  absences: Absence[] = [];
  holidays: { [date: string]: string } = {};

  constructor(
    private absenceService: AbsenceService,
  ) {}

  ngOnInit() {
    this.loadAbsences(21);
    this.loadHolidays(this.selectedYear);
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
  
    // Jour de la semaine (0 = dimanche, 1 = lundi, etc.)
    let startDayOfWeek = firstDayOfMonth.getDay(); 
    if (startDayOfWeek === 0) {
      startDayOfWeek = 7; // Ajuste pour commencer la semaine par lundi
    }
  
    // Ajout de jours vides pour aligner les premiers jours
    for (let i = 1; i < startDayOfWeek; i++) {
      daysInMonth.push(null); // Null pour les jours vides
    }
  
    // Ajout des jours du mois
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
    this.loadHolidays(this.selectedYear);
  }

  chunk<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  getAbsenceType(day: number): string | null {
    const dateKey = new Date(this.selectedYear, this.selectedMonth, day).setHours(0, 0, 0, 0);
  
    const absence = this.absences.find((absence) => {
      const startDate = new Date(absence.dateDebut).setHours(0, 0, 0, 0);
      const endDate = new Date(absence.dateFin).setHours(0, 0, 0, 0);
  
      return dateKey >= startDate && dateKey <= endDate;
    });
  
    return absence ? absence.type : null;
  }
  
  isToday(day: number): boolean {
    const today = new Date();
    const dateKey = new Date(this.selectedYear, this.selectedMonth, day);
  
    return (
      today.getFullYear() === dateKey.getFullYear() &&
      today.getMonth() === dateKey.getMonth() &&
      today.getDate() === dateKey.getDate()
    );
  }

  loadHolidays(year: number) {
    this.absenceService.getHolidays(year).subscribe((data) => {
      // Convertir les dates en clés (format ISO 8601 simplifié : YYYY-MM-DD)
      this.holidays = {};
      for (const date of Object.keys(data)) {
        const holidayDate = new Date(date).toISOString().split('T')[0];
        this.holidays[holidayDate] = data[date]; // Ajouter le nom du jour férié
      }
    });
  }

  isHoliday(day: number): boolean {
    // Construire la date à partir de l'année, du mois et du jour sélectionnés
    const dateKey = new Date(this.selectedYear, this.selectedMonth, day).toISOString().split('T')[0];
    return this.holidays.hasOwnProperty(dateKey);
  }

  getHolidayName(day: number): string {
    const dateKey = new Date(this.selectedYear, this.selectedMonth, day).toISOString().split('T')[0];
    return this.holidays[dateKey] || '';
  }
}
