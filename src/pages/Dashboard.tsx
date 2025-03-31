
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats, fetchSignalements } from '@/services/dataService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Calendar, CheckCircle, Clock, Wrench } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });

  const { data: signalements, isLoading: isLoadingSignalements } = useQuery({
    queryKey: ['signalements'],
    queryFn: fetchSignalements,
  });

  const { data: maintenances, isLoading: isLoadingMaintenances } = useQuery({
    queryKey: ['maintenances'],
    queryFn: fetchSignalements, // This should be fetching maintenances but we'll fix that later
  });

  const isLoading = isLoadingStats || isLoadingSignalements || isLoadingMaintenances;

  // Colors for charts
  const COLORS = ['#0088FE', '#FFBB28', '#00C49F', '#FF8042'];
  const STATUS_COLORS = {
    new: '#FF8042',
    inProgress: '#FFBB28',
    repaired: '#00C49F',
    scheduled: '#0088FE',
    completed: '#00C49F'
  };

  // For status pie chart
  const getStatusData = () => {
    if (!stats) return [];
    
    return [
      { name: 'Nouveaux', value: stats.signalementsByStatus.new, color: STATUS_COLORS.new },
      { name: 'En cours', value: stats.signalementsByStatus.inProgress, color: STATUS_COLORS.inProgress },
      { name: 'Réparés', value: stats.signalementsByStatus.repaired, color: STATUS_COLORS.repaired },
    ];
  };

  // For severity bar chart
  const getSeverityData = () => {
    if (!stats) return [];
    
    return [
      { name: 'Faible', value: stats.signalementsBySeverity.low },
      { name: 'Moyenne', value: stats.signalementsBySeverity.medium },
      { name: 'Élevée', value: stats.signalementsBySeverity.high },
    ];
  };

  // For maintenance status chart
  const getMaintenanceStatusData = () => {
    if (!stats) return [];
    
    return [
      { name: 'Planifiées', value: stats.maintenancesByStatus.scheduled, color: STATUS_COLORS.scheduled },
      { name: 'En cours', value: stats.maintenancesByStatus.inProgress, color: STATUS_COLORS.inProgress },
      { name: 'Terminées', value: stats.maintenancesByStatus.completed, color: STATUS_COLORS.completed },
    ];
  };

  // Recent signalements
  const getRecentSignalements = () => {
    if (!signalements) return [];
    
    return [...signalements]
      .sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())
      .slice(0, 5);
  };

  // Upcoming maintenances
  const getUpcomingMaintenances = () => {
    if (!maintenances) return [];
    
    return [...maintenances]
      .filter(m => m.status !== 'completed')
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
      .slice(0, 5);
  };

  const renderStatCards = () => {
    if (isLoading) {
      return Array(4).fill(0).map((_, index) => (
        <Card key={index} className="shadow-sm">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20" />
          </CardContent>
        </Card>
      ));
    }

    if (!stats) return null;

    // Calculate repair rate
    const repairRate = stats.totalSignalements > 0 
      ? Math.round((stats.signalementsByStatus.repaired / stats.totalSignalements) * 100) 
      : 0;

    // Calculate active maintenances
    const activeMaintenances = stats.maintenancesByStatus.scheduled + stats.maintenancesByStatus.inProgress;

    return (
      <>
        <Card className="shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Signalements ce mois</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.signalementsThisMonth}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Nids-de-poule réparés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.signalementsByStatus.repaired}</div>
            <p className="text-xs text-muted-foreground">
              {repairRate}% du total ({stats.totalSignalements})
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Maintenances en attente</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.maintenancesByStatus.scheduled}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Maintenances terminées</CardTitle>
            <Wrench className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.maintenancesByStatus.completed}</div>
            <p className="text-xs text-muted-foreground">
              ce mois: {stats.maintenancesCompletedThisMonth}
            </p>
          </CardContent>
        </Card>
      </>
    );
  };

  const renderLoadingState = () => (
    <div className="space-y-4">
      <Skeleton className="h-[300px] w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {renderStatCards()}
      </div>
      
      {isLoading ? (
        renderLoadingState()
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Distribution par statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getStatusData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={(entry) => entry.name}
                      >
                        {getStatusData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Répartition par gravité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getSeverityData()}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Nombre de signalements" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-sm lg:col-span-1">
              <CardHeader>
                <CardTitle>Statut des maintenances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getMaintenanceStatusData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={(entry) => entry.name}
                      >
                        {getMaintenanceStatusData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle>Signalements récents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getRecentSignalements().map((signalement) => (
                    <Alert key={signalement.id} variant="outline">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="text-sm font-medium">
                        Signalement {signalement.id} - 
                        <span className={
                          signalement.severity === 'high' ? 'text-red-500' : 
                          signalement.severity === 'medium' ? 'text-orange-500' : 
                          'text-green-500'
                        }>
                          {' '}
                          {signalement.severity === 'high' ? 'Grave' : 
                          signalement.severity === 'medium' ? 'Moyen' : 
                          'Léger'}
                        </span>
                      </AlertTitle>
                      <AlertDescription className="text-xs">
                        {signalement.address} - {new Date(signalement.reportDate).toLocaleDateString()}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
