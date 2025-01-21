export interface AbsenceView {
  idAbsence: number;
  dates: string;
  type: string;
  statut: string;
  motif: string;
  utilisateur: {  nom: string; image: string; };
}
