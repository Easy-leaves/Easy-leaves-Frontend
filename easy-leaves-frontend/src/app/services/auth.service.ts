import { Injectable } from '@angular/core';
import { GuardsCheckEnd } from '@angular/router';
import * as jwt_decode from 'jwt-decode';


@Injectable({
    providedIn: 'root', // Cela rend le service disponible dans toute l'application
})
export class AuthService {

    constructor() { }



    // Exemple de méthode pour obtenir l'ID de l'utilisateur authentifié
    getAuthenticatedUserId(): number {
        // Remplacez cette implémentation par la logique réelle
        return 21; // Par exemple, l'utilisateur avec l'ID 21
    }
}



