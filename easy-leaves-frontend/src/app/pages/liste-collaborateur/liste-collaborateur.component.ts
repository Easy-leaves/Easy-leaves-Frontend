import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UtilisateursService } from '../../services/utilisateurs/utilisateurs.service';

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
  departementId: number = 1;


  constructor(private utilisateursService: UtilisateursService) {}

  ngOnInit(): void {
    this.generateDaysOfMonth(this.selectedMonth);
    this.fetchUserConnected();
    // this.fetchPublicHolidays();
  }

  generateDaysOfMonth(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: days }, (_, i) => {
      const dayDate = new Date(year, month, i + 1);
      const dayLetter = dayDate.toLocaleDateString('fr-FR', { weekday: 'short' })[0].toUpperCase();
      return { day: i + 1, letter: dayLetter };
    });
  }

  onMonthChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.selectedMonth = new Date(value);
    this.generateDaysOfMonth(this.selectedMonth);
    this.fetchCollaborators(this.departementId);
    // this.fetchPublicHolidays();
  }

  changeMonth(direction: number): void {
    const newMonth = new Date(this.selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    this.selectedMonth = newMonth;
    this.generateDaysOfMonth(this.selectedMonth);
    this.fetchCollaborators(this.departementId);
    // this.fetchPublicHolidays();
  }

  fetchUserConnected(): void {
    const userId = localStorage.getItem("idUser");
    this.utilisateursService.getUserById(parseInt(userId || '0')).subscribe({
      next: (data) => {
        this.departementId = data.departement;
        this.fetchCollaborators(this.departementId);
      },
      error: (err) => console.error('Error fetching department:', err),
    });
  }


  fetchCollaborators(idDepartement: number) {
    this.utilisateursService.getUsersByDepartement(idDepartement).subscribe({
      next: (data) => {
        this.collaborators = data.map((user: any) => ({
          id: user.id,
          name: `${user.nom} ${user.prenom}`,
          dailyData: Array(this.daysInMonth.length).fill('')
        }));

        this.fetchAbsences();
        // this.fetchPublicHolidays();
      },
      error: (err) => console.error('Error fetching collaborators:', err),
    });
  }

  fetchAbsences() {
    const month = this.selectedMonth.getMonth() + 1;
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


  // DO NOT USE NOW CAUSE SOMETIMES IT DOES NOT WORK
  fetchPublicHolidays() {
    this.utilisateursService.getPublicHolidays().subscribe({
      next: (holidays) => {
        Object.entries(holidays as Record<string, string>).forEach(([date, name]) => {
          const holidayDate = new Date(date);
          if (
            holidayDate.getMonth() === this.selectedMonth.getMonth() &&
            holidayDate.getFullYear() === this.selectedMonth.getFullYear()
          ) {
            const day = holidayDate.getDate();
            const dayIndex = this.daysInMonth.findIndex((dayInfo) => dayInfo.day === day);

            if (dayIndex !== -1) {
              this.collaborators.forEach((collaborator) => {
                collaborator.dailyData[dayIndex] = 'FERIE';
              });
            }
          }
        });
      },
      error: (err) => console.error('Error fetching public holidays:', err),
    });
  }



getAbsenceClass(absenceType: string): string {
    switch (absenceType) {
      case 'RTT_EMPLOYEUR':
        return 'bg-purple-500 text-white'; // Blue for RTT Employeur
      case 'RTT_EMPLOYE':
        return 'bg-indigo-500 text-white'; // Green for RTT Employé
      case 'CONGE_PAYE':
        return 'bg-green-500 text-white'; // Yellow for Congé Payé
      case 'CONGE_SANS_SOLDE':
        return 'bg-red-500 text-white'; // Red for Congé Sans Solde
      case 'AUTRE':
        return 'bg-gray-500 text-white'; // Purple for Autre
      case 'FERIE':
        return 'bg-yellow-400 text-white'; // Gray for public holidays
      default:
        return '';
    }
  }
}
