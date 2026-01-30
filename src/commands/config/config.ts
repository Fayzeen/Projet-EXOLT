export const botConfig = {
  language: "fr",
  filter: {
    active: null as string | null,
    options: [
      {
        label: "CV",
        value: "cv",
        description: "Candidatures, curriculum vitae",
      },
      {
        label: "Commande",
        value: "commande",
        description: "Achats, commandes client",
      },
      {
        label: "Offre de travail",
        value: "travail",
        description: "Propositions d'emploi, missions",
      },
      {
        label: "Facture",
        value: "facture",
        description: "Factures, paiements",
      },
    ],
  },
};
