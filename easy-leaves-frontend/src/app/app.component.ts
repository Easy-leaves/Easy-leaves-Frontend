import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'easy-leaves-frontend';
  showHeader = true;
  isLoading = false;  // Default false to prevent flashing on first load

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true; // Start loading on route change
      }
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.isLoading = false; // Ensure smooth transition
          this.showHeader = !event.urlAfterRedirects.includes('login');
        }, 300); // Small delay to prevent flickering
      }
    });
  }
}
