import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStats, fetchRecentSignalements } from '@/services/dataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Metric, Text } from '@/components/ui/metric';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const STATUS_COLORS = {
  new: '#FFB74D',       // Orange
  inProgress: '#64B5F6',  // Blue
  repaired: '#81C784',    // Green
};

const SEVERITY_COLORS = {
  low: '#81C784',
  medium: '#FFB74D',
  high: '#E57373',
};

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  });

  const { data: recentSignalements } = useQuery({
    queryKey: ['recentSignalements'],
    queryFn: fetchRecentSignalements,
  });

  const renderStatCards = () => {
    if (isLoading) {
      return Array(4).fill(null).map((_, i) => (
        <Card key={i} className="shadow-sm">
          <CardHeader>
            <CardTitle><Skeleton className="h-4 w-32" /></CardTitle>
            <CardDescription><Skeleton className="h-3 w-64" /></CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ));
    }

    return (
      <>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Signalements Totaux</CardTitle>
            <CardDescription>Nombre total de signalements</CardDescription>
          </CardHeader>
          <CardContent>
            <Metric>{stats?.totalSignalements}</Metric>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Signalements Récents</CardTitle>
            <CardDescription>Signalements des 7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <Metric>{stats?.recentSignalements}</Metric>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Taux de Réparation</CardTitle>
            <CardDescription>Pourcentage de signalements réparés</CardDescription>
          </CardHeader>
          <CardContent>
            <Metric>
              {stats?.repairRate}%
            </Metric>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Maintenances en Cours</CardTitle>
            <CardDescription>Nombre de maintenances actuellement en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <Metric>{stats?.activeMaintenances}</Metric>
          </CardContent>
        </Card>
      </>
    );
  };

  const renderLoadingState = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array(3).fill(null).map((_, i) => (
        <Card key={i} className="shadow-sm">
          <CardHeader>
            <CardTitle><Skeleton className="h-4 w-32" /></CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // For severity bar chart
  const getSeverityData = () => {
    if (!stats) return [];

    return [
      { name: 'Faible', value: stats.signalementsBySeverity.low, color: SEVERITY_COLORS.low },
      { name: 'Moyenne', value: stats.signalementsBySeverity.medium, color: SEVERITY_COLORS.medium },
      { name: 'Élevée', value: stats.signalementsBySeverity.high, color: SEVERITY_COLORS.high },
    ];
  };

  // For maintenance status pie chart
  const getMaintenanceStatusData = () => {
    if (!stats) return [];

    return [
      { name: 'Planifiée', value: stats.maintenancesByStatus.scheduled, color: STATUS_COLORS.new },
      { name: 'En cours', value: stats.maintenancesByStatus.inProgress, color: STATUS_COLORS.inProgress },
      { name: 'Terminée', value: stats.maintenancesByStatus.completed, color: STATUS_COLORS.repaired },
    ];
  };

  const getRecentSignalements = () => {
    return recentSignalements || [];
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
                    <Alert key={signalement.id}>
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
