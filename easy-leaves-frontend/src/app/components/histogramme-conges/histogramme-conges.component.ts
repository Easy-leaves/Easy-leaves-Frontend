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
  absencesByDay: { [day: string]: { name: string; color: string }[] } = {
    Lundi: [],
    Mardi: [],
    Mercredi: [],
    Jeudi: [],
    Vendredi: [],
    Samedi: [],
    Dimanche: [],
  };
  selectedWeek: { startDate: Date; endDate: Date } | null = null;
  userColors: { [userId: number]: string } = {};

  constructor(private utilisateursService: UtilisateursService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initializeWeek();
    this.fetchAbsenceData();
  }

  initializeWeek(): void {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    this.selectedWeek = { startDate: startOfWeek, endDate: endOfWeek };
  }

  fetchAbsenceData(): void {
    const departementId = 1;
    this.utilisateursService.getUsersByDepartement(departementId).subscribe({
      next: (users) => {
        users.forEach((user: any) => {
          if (!this.userColors[user.id]) {
            this.userColors[user.id] = this.getRandomColor();
          }

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

  processAbsences(absences: any[], user: any): void {
    if (!absences.length && user.nom.startsWith('User')) {
      return;
    }

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
      while (currentDate <= new Date(absence.dateFin)) {
        const dayOfWeek = currentDate.toLocaleDateString('fr-FR', { weekday: 'long' });
        const dayInFrench = this.capitalize(dayOfWeek);

        if (
          this.absencesByDay[dayInFrench] !== undefined &&
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

  changeWeek(direction: number): void {
    const newStartDate = new Date(this.selectedWeek!.startDate);
    newStartDate.setDate(newStartDate.getDate() + direction * 7);

    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newStartDate.getDate() + 6);

    this.selectedWeek = { startDate: newStartDate, endDate: newEndDate };

    // Reset data and fetch new absences
    this.absencesByDay = {
      Lundi: [],
      Mardi: [],
      Mercredi: [],
      Jeudi: [],
      Vendredi: [],
      Samedi: [],
      Dimanche: [],
    };
    this.fetchAbsenceData();
  }

  generateChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = document.getElementById('absenceChart') as HTMLCanvasElement;

    // Generate labels with day names and dates
    const labels = Object.keys(this.absencesByDay).map((day, index) => {
      // Calculate the corresponding date for each day of the selected week
      const startDate = new Date(this.selectedWeek!.startDate);
      const dayDate = new Date(startDate.setDate(startDate.getDate() + index)); // Adjust day

      // Format the label to include day name and date (e.g., "Lundi\n22/01")
      return `${day}\n${dayDate.getDate().toString().padStart(2, '0')}/${(dayDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
    });

    // Prepare datasets for the stacked bar chart
    const datasets = Object.keys(this.userColors)
      .map((userId) => {
        const userName = Object.values(this.absencesByDay)
          .flat()
          .find((absence) => absence.color === this.userColors[+userId])?.name;

        if (!userName) return null;

        return {
          label: userName,
          data: Object.keys(this.absencesByDay).map(
            (day) =>
              this.absencesByDay[day].filter(
                (absence) => absence.color === this.userColors[+userId]
              ).length
          ),
          backgroundColor: this.userColors[+userId],
          borderWidth: 1,
        };
      })
      .filter((dataset) => dataset !== null);

    // Render the chart
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: datasets as any[],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allow custom width/height
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                size: 14,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const datasetIndex = tooltipItem.datasetIndex!;
                const dataset = datasets[datasetIndex] as any;
                const userName = dataset?.label || 'Utilisateur inconnu';
                return `${userName}: ${tooltipItem.raw} absence(s)`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Jours de la semaine',
            },
            ticks: {
              callback: function (value: any, index: number, values: any) {
                // Adjust the X-axis ticks to display multiline labels (day name and date)
                const label = labels[index];
                return label;
              },
            },
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: 'Nombre total d’absences',
            },
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }


  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  exportToExcel(): void {
    // Prepare data for Excel export
    const exportData = Object.keys(this.absencesByDay).map((day, index) => {
      // Get the date for the day
      const startDate = new Date(this.selectedWeek!.startDate);
      const dayDate = new Date(startDate.setDate(startDate.getDate() + index));
      const formattedDate = `${dayDate.getDate().toString().padStart(2, '0')}/${(dayDate.getMonth() + 1).toString().padStart(2, '0')}`;

      // Prepare the row data
      const absences = this.absencesByDay[day]
        .map((absence) => `${absence.name} (${absence.color})`)
        .join(', ');

      return {
        Day: day,
        Date: formattedDate,
        Absences: absences,
      };
    });

    // Convert data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Histogram Data');

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, 'histogramme_absences.xlsx');
  }
}
