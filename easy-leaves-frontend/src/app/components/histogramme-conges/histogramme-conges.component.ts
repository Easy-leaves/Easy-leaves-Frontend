import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilisateursService } from '../../services/utilisateurs/utilisateurs.service';
import { Chart, registerables } from 'chart.js';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-histogramme-conges',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './histogramme-conges.component.html',
  styleUrls: ['./histogramme-conges.component.css'],
})
export class HistogrammeCongesComponent implements OnInit {
  chart: any;
  absencesByDay: { [day: string]: { name: string; color: string }[] } = this.initializeAbsencesByDay();
  selectedWeek: { startDate: Date; endDate: Date } | null = null;
  userColors: { [userId: number]: string } = {};
  departementId: number = 1;

  constructor(private utilisateursService: UtilisateursService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initializeWeek();
    this.fetchUserConnected();
  }


  /**
   * Initializes the days of the week with empty absence data.
   */
  initializeAbsencesByDay(): { [day: string]: { name: string; color: string }[] } {
    return {
      Lundi: [],
      Mardi: [],
      Mercredi: [],
      Jeudi: [],
      Vendredi: [],
      Samedi: [],
      Dimanche: [],
    };
  }


  /**
   * Sets the selected week to the current week (Monday to Sunday).
   */
  initializeWeek(): void {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    this.selectedWeek = { startDate: startOfWeek, endDate: endOfWeek };
  }

  fetchUserConnected(): void {
    const userId = localStorage.getItem("idUser");
    this.utilisateursService.getUserById(parseInt(userId || '0')).subscribe({
      next: (data) => {
        this.departementId = data.departement;
        this.fetchAbsenceData(this.departementId);
      },
      error: (err) => console.error('Error fetching department:', err),
    });
  }


  /**
   * Fetches user data and their absences for the selected department and populates the chart data.
   */
  fetchAbsenceData(departementId: number): void {
    this.utilisateursService.getUsersByDepartement(departementId).subscribe({
      next: (users) => {
        users.forEach((user: any) => {
          // Assign a color to the user if not already assigned
          if (!this.userColors[user.id]) {
            this.userColors[user.id] = this.getRandomColor();
          }

          // Fetch absences for the user
          this.utilisateursService.getAbsencesByUser(user.id).subscribe({
            next: (absences) => {
              this.processAbsences(absences, user);
              this.generateChart();
            },
            error: (err) => console.error(`Error fetching absences for user ${user.id}:`, err),
          });
        });
      },
      error: (err) => console.error('Error fetching users by department:', err),
    });
  }


  /**
   * Processes the absences of a user and populates the data for each day of the week.
   */
  processAbsences(absences: any[], user: any): void {
    const weekAbsences = absences.filter((absence) => {
      const startDate = new Date(absence.dateDebut);
      const endDate = new Date(absence.dateFin);
      return (
        startDate <= this.selectedWeek!.endDate &&
        endDate >= this.selectedWeek!.startDate
      );
    });

    weekAbsences.forEach((absence) => {
      let currentDate = new Date(absence.dateDebut);

      // Add each absence to the corresponding day
      while (currentDate <= new Date(absence.dateFin)) {
        const dayOfWeek = currentDate.toLocaleDateString('fr-FR', { weekday: 'long' });
        const dayInFrench = this.capitalize(dayOfWeek);

        if (
          this.absencesByDay[dayInFrench] &&
          !this.absencesByDay[dayInFrench].some((a) => a.name === `${user.nom} ${user.prenom}`)
        ) {
          this.absencesByDay[dayInFrench].push({
            name: `${user.nom} ${user.prenom}`,
            color: this.userColors[user.id],
          });
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
  }


  /**
   * Changes the selected week (forward or backward) and refreshes the data.
   */
  changeWeek(direction: number): void {
    const newStartDate = new Date(this.selectedWeek!.startDate);
    newStartDate.setDate(newStartDate.getDate() + direction * 7);

    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newStartDate.getDate() + 6);

    this.selectedWeek = { startDate: newStartDate, endDate: newEndDate };
    this.absencesByDay = this.initializeAbsencesByDay();
    this.fetchAbsenceData(this.departementId);
  }


  /**
   * Generates a stacked bar chart to display absences by day.
   */
  generateChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = document.getElementById('absenceChart') as HTMLCanvasElement;

    const labels = Object.keys(this.absencesByDay).map((day, index) => {
      const dayDate = new Date(this.selectedWeek!.startDate);
      dayDate.setDate(dayDate.getDate() + index);
      return `${day}\n${dayDate.getDate().toString().padStart(2, '0')}/${(dayDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
    });

    const datasets = Object.keys(this.userColors).map((userId) => {
      const userName = Object.values(this.absencesByDay)
        .flat()
        .find((absence) => absence.color === this.userColors[+userId])?.name;

      if (!userName) return null;

      return {
        label: userName,
        data: Object.keys(this.absencesByDay).map(
          (day) => this.absencesByDay[day].filter((a) => a.color === this.userColors[+userId]).length
        ),
        backgroundColor: this.userColors[+userId],
      };
    }).filter((dataset) => dataset !== null);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: datasets as any[],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const dataset = datasets[tooltipItem.datasetIndex!];
                return `${dataset?.label || 'Utilisateur inconnu'}: ${tooltipItem.raw} absence(s)`;
              },
            },
          },
        },
        scales: {
          x: { stacked: true, title: { display: true, text: 'Jours de la semaine' } },
          y: { stacked: true, title: { display: true, text: 'Nombre total d’absences' }, beginAtZero: true },
        },
      },
    });
  }


  /**
   * Exports the absence data to an Excel file.
   */
  exportToExcel(): void {
    const exportData = Object.keys(this.absencesByDay).map((day, index) => {
      const dayDate = new Date(this.selectedWeek!.startDate);
      dayDate.setDate(dayDate.getDate() + index);
      const formattedDate = `${dayDate.getDate().toString().padStart(2, '0')}/${(dayDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;

      const absences = this.absencesByDay[day]
        .map((absence) => `${absence.name} (${absence.color})`)
        .join(', ');

      return { Day: day, Date: formattedDate, Absences: absences };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Histogram Data');
    XLSX.writeFile(workbook, 'histogramme_absences.xlsx');
  }


  /**
   * Capitalizes the first letter of a word.
   */
  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }


  /**
   * Generates a random color in hex format.
   */
  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    return `#${Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('')}`;
  }
}
