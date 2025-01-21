export interface AbsenceModel {
	idAbsence: number;
	dateDebut: Date;
	dateFin: Date;
	type: string;
	statut: string;
	motif: string;
  utilisateur: {  nom: string; image: string; };
}
