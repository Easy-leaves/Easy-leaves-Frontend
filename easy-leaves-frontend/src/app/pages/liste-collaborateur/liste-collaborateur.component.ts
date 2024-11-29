import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-liste-collaborateur',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-collaborateur.component.html',
  styleUrls: ['./liste-collaborateur.component.css']
})
export class ListeCollaborateurComponent {
  collaborators: string[] = ['Alice', 'Bob', 'Charlie', 'Diana'];
  selectedMonth: Date = new Date();
  daysInMonth: number[] = [];

  constructor() {
    this.generateDaysOfMonth(this.selectedMonth);
  }

  generateDaysOfMonth(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: days }, (_, i) => i + 1);
  }

  onMonthChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.selectedMonth = new Date(value);
    this.generateDaysOfMonth(this.selectedMonth);
  }
}
