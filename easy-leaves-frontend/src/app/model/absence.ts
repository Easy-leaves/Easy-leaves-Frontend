export interface Absence {
    id: number;
    dateDebut: Date;
    dateFin: Date;
    motif: string;
    statut: string;
    utilisateurId: number;
  }