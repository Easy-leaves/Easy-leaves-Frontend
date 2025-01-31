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
  departementId: number = 0;

  constructor(private utilisateursService: UtilisateursService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initializeWeek();
    this.fetchUserConnected();
  }


  // Initialise les jours de la semaine avec des données d'absence vides
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


  // Définit la semaine sélectionnée sur la semaine en cours (du lundi au dimanche)
  initializeWeek(): void {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    this.selectedWeek = { startDate: startOfWeek, endDate: endOfWeek };
  }

  // Récupère l'utilisateur connecté et son département, puis charge les absences correspondantes
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


  // Récupère les utilisateurs du département sélectionné ainsi que leurs absences et génère les données du graphique
  fetchAbsenceData(departementId: number): void {
    this.utilisateursService.getUsersByDepartement(departementId).subscribe({
      next: (users) => {
        users.forEach((user: any) => {
          // Associe une couleur unique à chaque utilisateur
          if (!this.userColors[user.id]) {
            this.userColors[user.id] = this.getRandomColor();
          }

          // Récupère les absences de l'utilisateur
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


  // Traite les absences d'un utilisateur et met à jour les données des absences par jour de la semaine
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

      // Ajoute chaque absence au jour correspondant
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


  // Modifie la semaine sélectionnée (vers l'avant ou vers l'arrière) et rafraîchisse les données
  changeWeek(direction: number): void {
    const newStartDate = new Date(this.selectedWeek!.startDate);
    newStartDate.setDate(newStartDate.getDate() + direction * 7);

    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newStartDate.getDate() + 6);

    this.selectedWeek = { startDate: newStartDate, endDate: newEndDate };
    this.absencesByDay = this.initializeAbsencesByDay();
    this.fetchAbsenceData(this.departementId);
  }


  // Génère un graphique à barres empilé pour afficher les absences par jour
  generateChart(): void {
    // Détruit le graphique précédent s'il existe pour éviter les doublons
    if (this.chart) {
      this.chart.destroy();
    }

    // Récupère l'élément canvas où le graphique sera affiché
    const ctx = document.getElementById('absenceChart') as HTMLCanvasElement;

    // Génère les labels des jours avec le format "NomJour JJ/MM"
    const labels = Object.keys(this.absencesByDay).map((day, index) => {
      const dayDate = new Date(this.selectedWeek!.startDate);
      dayDate.setDate(dayDate.getDate() + index);
      return `${day}\n${dayDate.getDate().toString().padStart(2, '0')}/${(dayDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
    });

    // Création des datasets pour chaque utilisateur avec leurs absences respectives
    const datasets = Object.keys(this.userColors).map((userId) => {
      // Trouve le nom de l'utilisateur correspondant à la couleur
      const userName = Object.values(this.absencesByDay)
        .flat()
        .find((absence) => absence.color === this.userColors[+userId])?.name;

      // Si aucun utilisateur n'est trouvé, on ignore cet élément
      if (!userName) return null;

      return {
        label: userName, // Nom de l'utilisateur
        data: Object.keys(this.absencesByDay).map(
          (day) => this.absencesByDay[day].filter((a) => a.color === this.userColors[+userId]).length
        ), // Nombre d'absences par jour
        backgroundColor: this.userColors[+userId], // Couleur associée à l'utilisateur
      };
    }).filter((dataset) => dataset !== null); // Filtrer les valeurs nulles

    // Création du graphique avec Chart.js
    this.chart = new Chart(ctx, {
      type: 'bar', // Type de graphique en barres
      data: {
        labels, // Jours de la semaine
        datasets: datasets as any[], // Données des absences par utilisateur
      },
      options: {
        responsive: true, // S'adapte à la taille du conteneur
        maintainAspectRatio: false, // Désactive le ratio fixe
        plugins: {
          legend: { display: true }, // Affichage de la légende
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
          x: { stacked: true, title: { display: true, text: 'Jours de la semaine' } }, // Axe X empilé
          y: { stacked: true, title: { display: true, text: 'Nombre total d’absences' }, beginAtZero: true }, // Axe Y empilé
        },
      },
    });
  }


  // Exporte les données d'absence vers un fichier Excel
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


  // Met la première lettre d'un mot en majuscule
  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }


  // Génère une couleur aléatoire pour chaque utilisateur
  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    return `#${Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('')}`;
  }
}
