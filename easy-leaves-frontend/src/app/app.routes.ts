import { Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { AdministrateurComponent } from './components/administrateur/administrateur.component';
import { ListeCollaborateurComponent } from './components/liste-collaborateur/liste-collaborateur.component';
import { AbsenceComponent } from './components/absence/absence.component';
import { DeconnexionComponent } from './components/deconnexion/deconnexion.component';

export const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'login', component: LoginComponent },
  { path: 'administrateur', component: AdministrateurComponent },
  { path: 'listeCollaborateur', component: ListeCollaborateurComponent },
  { path: 'absence', component: AbsenceComponent },
  { path: 'deconnexion', component: DeconnexionComponent },
  { path: '**', redirectTo: 'login' }
];
