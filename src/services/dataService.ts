
import { 
  mockSignalements, 
  mockMaintenances, 
  mockTeams, 
  generateMockSignalements, 
  generateMockMaintenances 
} from './mockData';
import { 
  Signalement, 
  Maintenance, 
  Team,
  SignalementStatus, 
  MaintenanceStatus 
} from '@/types';

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock persistence 
let signalements = [...mockSignalements];
let maintenances = [...mockMaintenances];
let teams = [...mockTeams];

// Signalements API
export const fetchSignalements = async (): Promise<Signalement[]> => {
  await delay(500); // Simulate network delay
  return [...signalements];
};

export const fetchSignalement = async (id: string): Promise<Signalement | undefined> => {
  await delay(300);
  return signalements.find(s => s.id === id);
};

export const updateSignalementStatus = async (id: string, status: SignalementStatus): Promise<Signalement> => {
  await delay(300);
  const index = signalements.findIndex(s => s.id === id);
  if (index === -1) throw new Error('Signalement not found');
  
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

// Maintenance API
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
  if (index === -1) throw new Error('Maintenance not found');
  
  const updatedMaintenance = { 
    ...maintenances[index], 
    status,
    completionDate: status === 'completed' ? new Date().toISOString() : maintenances[index].completionDate
  };
  
  maintenances[index] = updatedMaintenance;
  
  // Update related signalements if maintenance is completed
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

export const createMaintenance = async (maintenance: Omit<Maintenance, 'id' | 'completionDate'>): Promise<Maintenance> => {
  await delay(700);
  const newMaintenance: Maintenance = {
    ...maintenance,
    id: `main-${Date.now()}`,
    completionDate: null,
  };
  
  maintenances = [newMaintenance, ...maintenances];
  
  // Update signalements with this maintenance ID
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

// Teams API
export const fetchTeams = async (): Promise<Team[]> => {
  await delay(300);
  return [...teams];
};

export const fetchTeamById = async (id: string): Promise<Team | undefined> => {
  await delay(200);
  return teams.find(t => t.id === id);
};

// Data export functions
export const exportSignalementsToCSV = async (): Promise<string> => {
  await delay(500);
  const headers = 'ID,Address,Coordinates,Report Date,Severity,Status,MaintenanceID\n';
  const rows = signalements.map(s => 
    `${s.id},${s.address},"${s.coordinates.lat},${s.coordinates.lng}",${s.reportDate},${s.severity},${s.status},${s.maintenanceId || ''}`
  ).join('\n');
  
  return headers + rows;
};

export const exportMaintenancesToCSV = async (): Promise<string> => {
  await delay(500);
  const headers = 'ID,Title,Scheduled Date,Completion Date,Status,Team,Repair Type,Duration\n';
  const rows = maintenances.map(m => 
    `${m.id},${m.title},${m.scheduledDate},${m.completionDate || ''},${m.status},${m.teamId},${m.repairType},${m.estimatedDuration}`
  ).join('\n');
  
  return headers + rows;
};

// Stats and dashboard data
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
  
  // Get last 5 signalements for recent list
  const recentSignalements = [...signalements]
    .sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())
    .slice(0, 5);
  
  return {
    signalementsByStatus,
    signalementsBySeverity,
    signalementsThisMonth,
    maintenancesByStatus,
    maintenancesCompletedThisMonth,
    totalSignalements: signalements.length,
    totalMaintenances: maintenances.length,
    recentSignalements,
  };
};
