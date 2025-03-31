
import { Signalement, Maintenance, Team, SeverityLevel, SignalementStatus, MaintenanceStatus } from '@/types';

// Images de nids-de-poule fictives (dans une vraie app, ce seraient des images téléchargées)
const potholeImages = [
  'https://www.govloop.com/wp-content/uploads/2015/07/3766893794_c5017e4fd5_b.jpg',
  'https://img.freepik.com/free-photo/damaged-asphalt-road-with-large-pothole-requiring-repair_123827-23183.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGhJ2J1JSn03Q3EKDi_DTHi9YZCOXGHYuEuw&usqp=CAU',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqR-VnF3VQiXcVBT_AQrdY46HRzM9EKa31vA&usqp=CAU',
  'https://images.thestar.com/t5rN3Cja8GGxXxK9X3zbTTOYOno=/1280x1024/smart/filters:cb(1574108903651)/https://www.thestar.com/content/dam/thestar/news/gta/2019/11/14/so-you-hit-a-pothole-on-a-gta-highway-good-luck-getting-compensation/pothole_highway.jpg',
];

// Adresses fictives
const addresses = [
  'Avenue Mohammed V, Rabat',
  'Boulevard Hassan II, Casablanca',
  'Rue Ibn Battouta, Marrakech',
  'Boulevard Mohammed VI, Tanger',
  'Avenue des FAR, Fès',
  'Avenue Moulay Ismail, Meknès',
  'Boulevard Allal El Fassi, Agadir',
  'Avenue de la Liberté, Tétouan',
];

// Fonction d'aide pour obtenir un élément aléatoire d'un tableau
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Fonction d'aide pour obtenir une date aléatoire dans les n derniers jours
const getRandomDate = (daysBack: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
};

// Fonction d'aide pour obtenir une date future aléatoire dans les n prochains jours
const getRandomFutureDate = (daysAhead: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead));
  return date.toISOString();
};

// Création d'équipes fictives
export const mockTeams: Team[] = [
  { id: '1', name: 'Équipe Alpha', members: 5, specialization: 'Réparations majeures' },
  { id: '2', name: 'Équipe Beta', members: 3, specialization: 'Réparations rapides' },
  { id: '3', name: 'Équipe Gamma', members: 4, specialization: 'Resurfaçage' },
  { id: '4', name: 'Équipe Delta', members: 6, specialization: 'Maintenance préventive' },
];

// Création de signalements de nids-de-poule fictifs
export const generateMockSignalements = (count: number): Signalement[] => {
  const signalements: Signalement[] = [];
  
  for (let i = 0; i < count; i++) {
    const severity: SeverityLevel = getRandomItem(['low', 'medium', 'high']);
    const status: SignalementStatus = getRandomItem(['new', 'inProgress', 'repaired']);
    const imageUrl = getRandomItem(potholeImages);
    
    signalements.push({
      id: `sig-${i + 1}`,
      imageUrl,
      thumbnailUrl: imageUrl,
      coordinates: {
        lat: 31.5 + (Math.random() * 2), // Approximation de latitude pour le Maroc
        lng: -9.5 + (Math.random() * 3), // Approximation de longitude pour le Maroc
      },
      address: getRandomItem(addresses),
      reportDate: getRandomDate(30),
      severity,
      status,
      description: 'Nid-de-poule détecté par l\'application mobile',
      detectedBy: getRandomItem(['ai', 'user']),
    });
  }
  
  return signalements;
};

// Création de tâches de maintenance fictives
export const generateMockMaintenances = (
  count: number,
  signalements: Signalement[]
): Maintenance[] => {
  const maintenances: Maintenance[] = [];
  
  for (let i = 0; i < count; i++) {
    const status: MaintenanceStatus = getRandomItem(['scheduled', 'inProgress', 'completed']);
    const assignedSignalements = signalements
      .filter(() => Math.random() > 0.7) // Sélection aléatoire de signalements
      .slice(0, Math.floor(Math.random() * 3) + 1); // 1-3 signalements par maintenance
    
    const scheduledDate = getRandomFutureDate(15);
    let completionDate;
    
    if (status === 'completed') {
      const scheduledDateTime = new Date(scheduledDate).getTime();
      const completionDateTime = scheduledDateTime + (Math.random() * 86400000 * 3); // 0-3 jours après la date prévue
      completionDate = new Date(completionDateTime).toISOString();
    }
    
    maintenances.push({
      id: `main-${i + 1}`,
      title: `Maintenance ${i + 1}`,
      description: 'Réparation de nids-de-poule signalés',
      scheduledDate,
      completionDate,
      status,
      teamId: getRandomItem(mockTeams).id,
      signalementIds: assignedSignalements.map(s => s.id),
      repairType: getRandomItem(['Remplissage', 'Resurfaçage', 'Réparation complète']),
      estimatedDuration: Math.floor(Math.random() * 5) + 1, // 1-5 heures
      notes: status === 'completed' ? 'Travail terminé à temps' : undefined,
    });
  }
  
  return maintenances;
};

// Génération des données initiales
const initialSignalements = generateMockSignalements(20);
const initialMaintenances = generateMockMaintenances(8, initialSignalements);

// Mise à jour des signalements avec les IDs de maintenance
initialSignalements.forEach(signalement => {
  const relatedMaintenance = initialMaintenances.find(m => 
    m.signalementIds.includes(signalement.id)
  );
  
  if (relatedMaintenance) {
    signalement.maintenanceId = relatedMaintenance.id;
    
    // Mise à jour du statut basé sur le statut de maintenance
    if (relatedMaintenance.status === 'completed') {
      signalement.status = 'repaired';
    } else if (relatedMaintenance.status === 'inProgress') {
      signalement.status = 'inProgress';
    }
  }
});

export const mockSignalements = initialSignalements;
export const mockMaintenances = initialMaintenances;
