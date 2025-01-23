export interface Absence {
    id: number;
    dateDebut: Date;
    dateFin: Date;
    type: string;
    motif: string;
    statut: string;
    utilisateurId: number;
  }