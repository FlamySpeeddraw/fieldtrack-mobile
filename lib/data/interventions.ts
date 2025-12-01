export type Intervention = {
  id: string;
  date: string;
  status: string;
  description: string;
  address: string;
  imageUrl?: string;
};

export const sampleData: Intervention[] = [
  {
    id: '1',
    date: '2025-12-01T09:00:00Z',
    status: 'En cours',
    description: "Contrôle des capteurs et vérification d'alimentation",
    address: '123 Rue Principale, Ville',
    imageUrl: 'https://via.placeholder.com/600x400.png?text=Intervention+1',
  },
  {
    id: '2',
    date: '2025-11-28T14:30:00Z',
    status: 'Terminé',
    description: 'Remplacement du module GPS',
    address: '45 Av. des Champs, Ville',
    imageUrl: 'https://via.placeholder.com/600x400.png?text=Intervention+2',
  },
  {
    id: '3',
    date: '2025-12-03T08:15:00Z',
    status: 'Planifié',
    description: 'Installation d\'un nouveau boîtier de communication',
    address: '10 Boulevard des Fleurs, Ville',
    imageUrl: 'https://via.placeholder.com/600x400.png?text=Intervention+3',
  },
  {
    id: '4',
    date: '2025-11-30T16:00:00Z',
    status: 'Planifié',
    description: 'Attente de pièces pour maintenance',
    address: '2 Rue du Port, Ville',
    imageUrl: 'https://via.placeholder.com/600x400.png?text=Intervention+4',
  },
  {
    id: '5',
    date: '2025-12-02T11:45:00Z',
    status: 'Terminé',
    description: 'Mise à jour du firmware et tests',
    address: '78 Route de la Gare, Ville',
    imageUrl: 'https://via.placeholder.com/600x400.png?text=Intervention+5',
  },
  {
    id: '6',
    date: '2025-11-25T09:30:00Z',
    status: 'Planifié',
    description: 'Intervention (anciennement annulée) - client indisponible',
    address: '4 Place du Marché, Ville',
  },
  {
    id: '7',
    date: '2025-12-05T13:00:00Z',
    status: 'En cours',
    description: 'Vérification des alarmes et du réseau',
    address: '200 Impasse Verte, Ville',
    imageUrl: 'https://via.placeholder.com/600x400.png?text=Intervention+7',
  },
  {
    id: '8',
    date: '2025-12-07T07:30:00Z',
    status: 'Planifié',
    description: 'Audit complet des installations',
    address: '56 Allée des Pins, Ville',
  },
];
