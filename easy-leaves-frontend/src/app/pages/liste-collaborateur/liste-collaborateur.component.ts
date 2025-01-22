import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UtilisateursService } from '../../services/utilisateurs.service';

@Component({
  selector: 'app-liste-collaborateur',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-collaborateur.component.html',
  styleUrls: ['./liste-collaborateur.component.css']
})
export class ListeCollaborateurComponent implements OnInit {
  collaborators: { id: number, name: string, dailyData: string[] }[] = [];
  selectedMonth: Date = new Date();
  daysInMonth: any[] = [];

  constructor(private utilisateursService: UtilisateursService) {}

  ngOnInit(): void {
    this.generateDaysOfMonth(this.selectedMonth);
    this.fetchCollaborators();
  }

  generateDaysOfMonth(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: days }, (_, i) => {
      const dayDate = new Date(year, month, i + 1);
      const dayLetter = dayDate.toLocaleDateString('fr-FR', { weekday: 'short' })[0].toUpperCase(); // Get first letter of the day
      return { day: i + 1, letter: dayLetter }; // Include both day and its first letter
    });
  }

  onMonthChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.selectedMonth = new Date(value);
    this.generateDaysOfMonth(this.selectedMonth);
    this.fetchCollaborators();
  }

  changeMonth(direction: number): void {
    const newMonth = new Date(this.selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    this.selectedMonth = newMonth;
    this.generateDaysOfMonth(this.selectedMonth);
    this.fetchCollaborators();
  }

  fetchCollaborators() {
    this.utilisateursService.getUsersByDepartement().subscribe({
      next: (data) => {
        this.collaborators = data.map((user: any) => ({
          id: user.id, // Assuming user.id exists in the response
          name: `${user.nom} ${user.prenom}`,
          dailyData: Array(this.daysInMonth.length).fill('') // Initialize empty daily data
        }));

        this.fetchAbsences();
      },
      error: (err) => console.error('Error fetching collaborators:', err),
    });
  }

  fetchAbsences() {
    const month = this.selectedMonth.getMonth() + 1; // 1-based month
    const year = this.selectedMonth.getFullYear();

    this.collaborators.forEach((collaborator) => {
      this.utilisateursService.getAbsencesByUser(collaborator.id).subscribe({
        next: (absences) => {
          absences.forEach((absence: any) => {
            const startDate = new Date(absence.dateDebut);
            const endDate = new Date(absence.dateFin);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
              console.error(`Invalid date range for ${collaborator.name}:`, {
                dateDebut: absence.dateDebut,
                dateFin: absence.dateFin,
              });
              return;
            }

            let currentDate = new Date(startDate);
            while (currentDate <= endDate) {
              if (
                currentDate.getMonth() + 1 === month &&
                currentDate.getFullYear() === year
              ) {
                const day = currentDate.getDate();
                const dayIndex = this.daysInMonth.findIndex(
                  (dayInfo) => dayInfo.day === day
                );

                if (dayIndex !== -1) {
                  collaborator.dailyData[dayIndex] = absence.type;
                }
              }

              currentDate.setDate(currentDate.getDate() + 1);
            }
          });
        },
        error: (err) =>
          console.error(
            `Error fetching absences for user ${collaborator.id}:`,
            err
          ),
      });
    });
  }


  getAbsenceClass(absenceType: string): string {
    switch (absenceType) {
      case 'RTT_EMPLOYEUR':
        return 'bg-blue-300 text-white'; // Blue for RTT Employeur
      case 'RTT_EMPLOYE':
        return 'bg-green-300 text-white'; // Green for RTT Employé
      case 'CONGE_PAYE':
        return 'bg-yellow-300 text-black'; // Yellow for Congé Payé
      case 'CONGE_SANS_SOLDE':
        return 'bg-red-300 text-white'; // Red for Congé Sans Solde
      case 'AUTRE':
        return 'bg-purple-300 text-white'; // Purple for Autre
      default:
        return '';
    }
  }
}
