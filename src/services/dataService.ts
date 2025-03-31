import { Signalement, Maintenance, Team, SeverityLevel, SignalementStatus, MaintenanceStatus } from '@/types';

// Mock data - replace with actual API calls in a real application
const signalements: Signalement[] = [
  {
    id: '1',
    imageUrl: 'https://picsum.photos/id/237/200/300',
    thumbnailUrl: 'https://picsum.photos/id/237/50/50',
    coordinates: { lat: 34.052235, lng: -118.243683 },
    address: '123 Main St, Los Angeles, CA',
    reportDate: '2024-01-20',
    severity: 'medium',
    status: 'new',
    description: 'Large pothole in the middle of the road.',
    detectedBy: 'user',
  },
  {
    id: '2',
    imageUrl: 'https://picsum.photos/id/238/200/300',
    thumbnailUrl: 'https://picsum.photos/id/238/50/50',
    coordinates: { lat: 34.052235, lng: -118.243683 },
    address: '456 Elm St, Los Angeles, CA',
    reportDate: '2024-01-22',
    severity: 'high',
    status: 'inProgress',
    description: 'Deep pothole causing damage to vehicles.',
    detectedBy: 'ai',
  },
  {
    id: '3',
    imageUrl: 'https://picsum.photos/id/239/200/300',
    thumbnailUrl: 'https://picsum.photos/id/239/50/50',
    coordinates: { lat: 34.052235, lng: -118.243683 },
    address: '789 Oak St, Los Angeles, CA',
    reportDate: '2024-01-25',
    severity: 'low',
    status: 'repaired',
    description: 'Small pothole, patched but needs review.',
    detectedBy: 'user',
  },
  {
    id: '4',
    imageUrl: 'https://picsum.photos/id/240/200/300',
    thumbnailUrl: 'https://picsum.photos/id/240/50/50',
    coordinates: { lat: 34.052235, lng: -118.243683 },
    address: '321 Pine St, Los Angeles, CA',
    reportDate: '2024-02-01',
    severity: 'medium',
    status: 'new',
    description: 'Pothole near a school, needs urgent attention.',
    detectedBy: 'ai',
  },
  {
    id: '5',
    imageUrl: 'https://picsum.photos/id/241/200/300',
    thumbnailUrl: 'https://picsum.photos/id/241/50/50',
    coordinates: { lat: 34.052235, lng: -118.243683 },
    address: '654 Maple St, Los Angeles, CA',
    reportDate: '2024-02-05',
    severity: 'high',
    status: 'inProgress',
    description: 'Large and deep pothole, blocking part of the road.',
    detectedBy: 'user',
  },
  {
    id: '6',
    imageUrl: 'https://picsum.photos/id/242/200/300',
    thumbnailUrl: 'https://picsum.photos/id/242/50/50',
    coordinates: { lat: 34.052235, lng: -118.243683 },
    address: '987 Cherry St, Los Angeles, CA',
    reportDate: '2024-02-10',
    severity: 'low',
    status: 'repaired',
    description: 'Pothole repaired, needs quality check.',
    detectedBy: 'ai',
  },
  {
    id: '7',
    imageUrl: 'https://picsum.photos/id/243/200/300',
    thumbnailUrl: 'https://picsum.photos/id/243/50/50',
    coordinates: { lat: 34.052235, lng: -118.243683 },
    address: '246 Palm St, Los Angeles, CA',
    reportDate: '2024-02-15',
    severity: 'medium',
    status: 'new',
    description: 'Multiple potholes on a busy street.',
    detectedBy: 'user',
  },
  {
    id: '8',
    imageUrl: 'https://picsum.photos/id/244/200/300',
    thumbnailUrl: 'https://picsum.photos/id/244/50/50',
    coordinates: { lat: 34.052235, lng: -118.243683 },
    address: '579 Olive St, Los Angeles, CA',
    reportDate: '2024-02-20',
    severity: 'high',
    status: 'inProgress',
    description: 'Pothole causing traffic congestion.',
    detectedBy: 'ai',
  },
  {
    id: '9',
    imageUrl: 'https://picsum.photos/id/245/200/300',
    thumbnailUrl: 'https://picsum.photos/id/245/50/50',
    coordinates: { lat: 34.052235, lng: -118.243683 },
    address: '812 Willow St, Los Angeles, CA',
    reportDate: '2024-02-25',
    severity: 'low',
    status: 'repaired',
    description: 'Pothole repair completed.',
    detectedBy: 'user',
  },
  {
    id: '10',
    imageUrl: 'https://picsum.photos/id/246/200/300',
    thumbnailUrl: 'https://picsum.photos/id/246/50/50',
    coordinates: { lat: 34.052235, lng: -118.243683 },
    address: '159 Walnut St, Los Angeles, CA',
    reportDate: '2024-03-01',
    severity: 'medium',
    status: 'new',
    description: 'Pothole near a bus stop.',
    detectedBy: 'ai',
  },
];

const maintenances: Maintenance[] = [
  {
    id: 'm1',
    title: 'Maintenance 1',
    description: 'Fix potholes on Main St',
    scheduledDate: '2024-02-28',
    completionDate: '2024-03-01',
    status: 'completed',
    teamId: 'team1',
    signalementIds: ['1', '2'],
    repairType: 'Remplissage',
    estimatedDuration: 8,
    notes: 'Use cold mix asphalt',
  },
  {
    id: 'm2',
    title: 'Maintenance 2',
    description: 'Resurface Elm St',
    scheduledDate: '2024-03-05',
    completionDate: null,
    status: 'inProgress',
    teamId: 'team2',
    signalementIds: ['3', '4'],
    repairType: 'Resurfaçage',
    estimatedDuration: 16,
    notes: 'Coordinate with traffic control',
  },
  {
    id: 'm3',
    title: 'Maintenance 3',
    description: 'Patch Oak St',
    scheduledDate: '2024-03-12',
    completionDate: null,
    status: 'scheduled',
    teamId: 'team1',
    signalementIds: ['5'],
    repairType: 'Réparation complète',
    estimatedDuration: 4,
    notes: 'Check weather forecast',
  },
];

const teams: Team[] = [
  {
    id: 'team1',
    name: 'Alpha Team',
    members: 5,
    specialization: 'Pothole Repair',
  },
  {
    id: 'team2',
    name: 'Beta Team',
    members: 7,
    specialization: 'Road Resurfacing',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Service functions
export const fetchSignalements = async (): Promise<Signalement[]> => {
  await delay(500);
  return signalements;
};

export const fetchSignalement = async (id: string): Promise<Signalement | undefined> => {
  await delay(300);
  return signalements.find(signalement => signalement.id === id);
};

export const fetchMaintenances = async (): Promise<Maintenance[]> => {
  await delay(500);
  return maintenances;
};

export const fetchTeams = async (): Promise<Team[]> => {
  await delay(300);
  return teams;
};

export const createMaintenance = async (maintenance: Omit<Maintenance, 'id' | 'completionDate'>): Promise<Maintenance> => {
  await delay(500);
  const newMaintenance: Maintenance = {
    id: Math.random().toString(36).substring(7),
    completionDate: null,
    ...maintenance,
  };
  maintenances.push(newMaintenance);
  
  // Mise à jour des signalements concernés
  maintenance.signalementIds.forEach(signalementId => {
    const signalement = signalements.find(s => s.id === signalementId);
    if (signalement) {
      signalement.maintenanceId = newMaintenance.id;
    }
  });
  
  return newMaintenance;
};

export const updateMaintenanceStatus = async (id: string, status: MaintenanceStatus): Promise<Maintenance | undefined> => {
  await delay(500);
  const maintenance = maintenances.find(m => m.id === id);
  if (maintenance) {
    maintenance.status = status;
    if (status === 'completed') {
      maintenance.completionDate = new Date().toISOString().split('T')[0];
    } else {
      maintenance.completionDate = null;
    }
  }
  return maintenance;
};

// Helper for filtering signalements
export const filterSignalements = async (filters: {
  status?: SignalementStatus;
  severity?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<Signalement[]> => {
  await delay(300);
  return signalements.filter(s => {
    if (filters.status && s.status !== filters.status) return false;
    if (filters.severity && s.severity !== filters.severity) return false;
    if (filters.dateFrom && new Date(s.reportDate) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(s.reportDate) > new Date(filters.dateTo)) return false;
    return true;
  });
};

// Helper function to generate CSV data for signalements
export const exportSignalementsToCSV = async (): Promise<string> => {
  await delay(300);
  const headers = "ID,Adresse,Date,Gravité,Statut,Description,Détecté par\n";
  const rows = signalements.map(s => 
    `${s.id},"${s.address}",${s.reportDate},${s.severity},${s.status},"${s.description?.replace(/"/g, '""') || ''}",${s.detectedBy}`
  );
  return headers + rows.join('\n');
};

// Helper function to generate CSV data for maintenances
export const exportMaintenancesToCSV = async (): Promise<string> => {
  await delay(300);
  const headers = "ID,Titre,Description,Date planifiée,Date de complétion,Statut,Équipe,Type de réparation,Durée estimée,Notes,Signalements\n";
  const rows = maintenances.map(m => {
    const signalementList = m.signalementIds.join(';');
    return `${m.id},"${m.title}","${m.description?.replace(/"/g, '""') || ''}",${m.scheduledDate},${m.completionDate || ''},${m.status},${m.teamId},${m.repairType},${m.estimatedDuration},"${m.notes?.replace(/"/g, '""') || ''}","${signalementList}"`;
  });
  return headers + rows.join('\n');
};

// Stats
export const fetchStats = async () => {
  await delay(300);

  const signalementsByStatus = signalements.reduce((acc: any, signalement) => {
    acc[signalement.status] = (acc[signalement.status] || 0) + 1;
    return acc;
  }, {});

  const signalementsBySeverity = signalements.reduce((acc: any, signalement) => {
    acc[signalement.severity] = (acc[signalement.severity] || 0) + 1;
    return acc;
  }, {});

  const maintenancesByStatus = maintenances.reduce((acc: any, maintenance) => {
    acc[maintenance.status] = (acc[maintenance.status] || 0) + 1;
    return acc;
  }, {});

  return {
    totalSignalements: signalements.length,
    totalMaintenances: maintenances.length,
    signalementsByStatus,
    signalementsBySeverity,
    maintenancesByStatus,
    recentSignalements: signalements.slice(-5),
  };
};
