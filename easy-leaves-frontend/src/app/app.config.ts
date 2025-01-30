import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptors, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthGuard } from './guard/auth.guard';
import { authInterceptor } from './interceptor/auth.interceptor';
import { EditAbsenceDialogComponent } from './components/edit-absence-dialog/edit-absence-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    AuthGuard,

  ]
};
