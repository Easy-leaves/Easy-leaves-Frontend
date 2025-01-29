import { Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AboutComponent } from './pages/about/about.component';
import { LoginComponent } from './pages/login/login.component';
import { AdministrateurComponent } from './pages/administrateur/administrateur.component';
import { ListeCollaborateurComponent } from './pages/liste-collaborateur/liste-collaborateur.component';
import { AbsencesComponent } from './pages/absences/absences.component';
import { DeconnexionComponent } from './pages/deconnexion/deconnexion.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'header', component: HeaderComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  {
    path: 'administrateur',
    component: AdministrateurComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMINISTRATEUR' }
  },
  {
    path: 'listeCollaborateur',
    component: ListeCollaborateurComponent,
    canActivate: [AuthGuard],
    data: { role: 'MANAGER' }
  },
  { path: 'absence', component: AbsencesComponent, canActivate: [AuthGuard] },
  { path: 'deconnexion', component: DeconnexionComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
