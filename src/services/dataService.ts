
import { 
  mockSignalements, 
  mockMaintenances, 
  mockTeams
} from './mockData';
import { 
  Signalement, 
  Maintenance, 
  Team,
  SignalementStatus, 
  MaintenanceStatus 
} from '@/types';

// Fonction d'aide pour simuler un délai d'API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Persistance fictive
let signalements = [...mockSignalements];
let maintenances = [...mockMaintenances];
let teams = [...mockTeams];

// API Signalements
export const fetchSignalements = async (): Promise<Signalement[]> => {
  await delay(500); // Simuler un délai réseau
  return [...signalements];
};

export const fetchSignalementById = async (id: string): Promise<Signalement | undefined> => {
  await delay(300);
  return signalements.find(s => s.id === id);
};

export const updateSignalementStatus = async (id: string, status: SignalementStatus): Promise<Signalement> => {
  await delay(300);
  const index = signalements.findIndex(s => s.id === id);
  if (index === -1) throw new Error('Signalement non trouvé');
  
  signalements[index] = { ...signalements[index], status };
  return signalements[index];
};

export const createSignalement = async (signalement: Omit<Signalement, 'id'>): Promise<Signalement> => {
  await delay(500);
  const newSignalement: Signalement = {
    ...signalement,
    id: `sig-${Date.now()}`,
  };
  signalements = [newSignalement, ...signalements];
  return newSignalement;
};

// Fonction d'aide pour filtrer les signalements
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

// API Maintenance
export const fetchMaintenances = async (): Promise<Maintenance[]> => {
  await delay(500);
  return [...maintenances];
};

export const fetchMaintenanceById = async (id: string): Promise<Maintenance | undefined> => {
  await delay(300);
  return maintenances.find(m => m.id === id);
};

export const updateMaintenanceStatus = async (id: string, status: MaintenanceStatus): Promise<Maintenance> => {
  await delay(500);
  const index = maintenances.findIndex(m => m.id === id);
  if (index === -1) throw new Error('Maintenance non trouvée');
  
  const updatedMaintenance = { 
    ...maintenances[index], 
    status,
    completionDate: status === 'completed' ? new Date().toISOString() : maintenances[index].completionDate
  };
  
  maintenances[index] = updatedMaintenance;
  
  // Mise à jour des signalements liés si la maintenance est terminée
  if (status === 'completed') {
    signalements = signalements.map(s => {
      if (updatedMaintenance.signalementIds.includes(s.id)) {
        return { ...s, status: 'repaired' };
      }
      return s;
    });
  } else if (status === 'inProgress') {
    signalements = signalements.map(s => {
      if (updatedMaintenance.signalementIds.includes(s.id)) {
        return { ...s, status: 'inProgress' };
      }
      return s;
    });
  }
  
  return updatedMaintenance;
};

export const createMaintenance = async (maintenance: Omit<Maintenance, 'id'>): Promise<Maintenance> => {
  await delay(700);
  const newMaintenance: Maintenance = {
    ...maintenance,
    id: `main-${Date.now()}`,
  };
  
  maintenances = [newMaintenance, ...maintenances];
  
  // Mise à jour des signalements avec l'ID de cette maintenance
  signalements = signalements.map(s => {
    if (newMaintenance.signalementIds.includes(s.id)) {
      return { 
        ...s, 
        maintenanceId: newMaintenance.id,
        status: newMaintenance.status === 'inProgress' ? 'inProgress' : s.status
      };
    }
    return s;
  });
  
  return newMaintenance;
};

// API Teams
export const fetchTeams = async (): Promise<Team[]> => {
  await delay(300);
  return [...teams];
};

export const fetchTeamById = async (id: string): Promise<Team | undefined> => {
  await delay(200);
  return teams.find(t => t.id === id);
};

// Fonctions d'exportation de données
export const exportSignalementsToCSV = async (): Promise<string> => {
  await delay(500);
  const headers = 'ID,Adresse,Coordonnées,Date Signalement,Gravité,Statut,ID Maintenance\n';
  const rows = signalements.map(s => 
    `${s.id},${s.address},"${s.coordinates.lat},${s.coordinates.lng}",${s.reportDate},${s.severity},${s.status},${s.maintenanceId || ''}`
  ).join('\n');
  
  return headers + rows;
};

export const exportMaintenancesToCSV = async (): Promise<string> => {
  await delay(500);
  const headers = 'ID,Titre,Date Planifiée,Date Achèvement,Statut,Équipe,Type Réparation,Durée\n';
  const rows = maintenances.map(m => 
    `${m.id},${m.title},${m.scheduledDate},${m.completionDate || ''},${m.status},${m.teamId},${m.repairType},${m.estimatedDuration}`
  ).join('\n');
  
  return headers + rows;
};

// Statistiques et données de tableau de bord
export const fetchDashboardStats = async () => {
  await delay(600);
  
  const currentDate = new Date();
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(currentDate.getMonth() - 1);
  
  const signalementsByStatus = {
    new: signalements.filter(s => s.status === 'new').length,
    inProgress: signalements.filter(s => s.status === 'inProgress').length,
    repaired: signalements.filter(s => s.status === 'repaired').length,
  };
  
  const signalementsBySeverity = {
    low: signalements.filter(s => s.severity === 'low').length,
    medium: signalements.filter(s => s.severity === 'medium').length,
    high: signalements.filter(s => s.severity === 'high').length,
  };
  
  const signalementsThisMonth = signalements.filter(s => 
    new Date(s.reportDate) >= lastMonthDate
  ).length;
  
  const maintenancesByStatus = {
    scheduled: maintenances.filter(m => m.status === 'scheduled').length,
    inProgress: maintenances.filter(m => m.status === 'inProgress').length,
    completed: maintenances.filter(m => m.status === 'completed').length,
  };
  
  const maintenancesCompletedThisMonth = maintenances.filter(m => 
    m.status === 'completed' && 
    m.completionDate && 
    new Date(m.completionDate) >= lastMonthDate
  ).length;
  
  return {
    signalementsByStatus,
    signalementsBySeverity,
    signalementsThisMonth,
    maintenancesByStatus,
    maintenancesCompletedThisMonth,
    totalSignalements: signalements.length,
    totalMaintenances: maintenances.length,
  };
};
