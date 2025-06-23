/**
 * Données des graphiques pour le dashboard des stages
 */

// Données pour le graphique en barres des offres par mois
export const offresParMoisData = {
  labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"],
  datasets: {
    label: "Offres créées",
    data: [8, 12, 15, 18, 22, 25, 20, 16, 19, 14, 10, 6],
  },
};

// Données pour le graphique linéaire des publications
export const publicationsData = {
  labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  datasets: [
    {
      label: "Offres publiées",
      color: "success",
      data: [2, 1, 4, 3, 5, 2, 3],
    },
  ],
};

// Données pour le graphique d'activité des utilisateurs
export const activiteUtilisateursData = {
  labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  datasets: [
    {
      label: "Connexions",
      color: "warning",
      data: [8, 12, 15, 10, 18, 14, 16],
    },
  ],
};

// Données pour le graphique des candidatures (si vous l'ajoutez plus tard)
export const candidaturesData = {
  labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"],
  datasets: [
    {
      label: "Candidatures reçues",
      color: "info",
      data: [45, 52, 38, 67, 73, 89],
    },
  ],
};

// Données pour les projets par technologie
export const projetsParTechnologieData = {
  labels: ["React", "Angular", "Vue.js", "Node.js", "Python", "Java", "PHP"],
  datasets: {
    label: "Projets",
    data: [12, 8, 6, 15, 10, 18, 7],
  },
};

export default {
  offresParMoisData,
  publicationsData,
  activiteUtilisateursData,
  candidaturesData,
  projetsParTechnologieData,
};
