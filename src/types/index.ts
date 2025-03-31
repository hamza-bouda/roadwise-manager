
// Niveau de gravité des nids-de-poule
export type SeverityLevel = 'low' | 'medium' | 'high';

// Statut d'un signalement de nid-de-poule
export type SignalementStatus = 'new' | 'inProgress' | 'repaired';

// Statut des tâches de maintenance
export type MaintenanceStatus = 'scheduled' | 'inProgress' | 'completed';

// Type pour une équipe de réparation
export type Team = {
  id: string;
  name: string;
  members: number;
  specialization?: string;
};

// Type pour un signalement de nid-de-poule
export type Signalement = {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  reportDate: string;
  severity: SeverityLevel;
  status: SignalementStatus;
  description?: string;
  detectedBy: 'ai' | 'user';
  maintenanceId?: string;
};

// Type pour une tâche de maintenance
export type Maintenance = {
  id: string;
  title: string;
  description?: string;
  scheduledDate: string;
  completionDate?: string;
  status: MaintenanceStatus;
  teamId: string;
  signalementIds: string[];
  repairType: string;
  estimatedDuration: number; // en heures
  notes?: string;
};
