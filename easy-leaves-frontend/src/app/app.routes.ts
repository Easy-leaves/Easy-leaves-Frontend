import { Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AboutComponent } from './pages/about/about.component';
import { LoginComponent } from './pages/login/login.component';
import { AdministrateurComponent } from './pages/administrateur/administrateur.component';
import { ListeCollaborateurComponent } from './pages/liste-collaborateur/liste-collaborateur.component';
import { AbsenceComponent } from './pages/absence/absence.component';
import { DeconnexionComponent } from './pages/deconnexion/deconnexion.component';


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
