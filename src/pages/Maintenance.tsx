import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMaintenances, fetchTeams, updateMaintenanceStatus, exportMaintenancesToCSV } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileDown, Plus, Calendar, Wrench, Clock } from 'lucide-react';
import { MaintenanceStatus } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateMaintenanceForm from '@/components/CreateMaintenanceForm';

const Maintenance = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightedId = searchParams.get('id');
  const queryClient = useQueryClient();
  
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { 
    data: maintenances, 
    isLoading: isLoadingMaintenances 
  } = useQuery({
    queryKey: ['maintenances'],
    queryFn: fetchMaintenances,
  });
  
  const { 
    data: teams, 
    isLoading: isLoadingTeams 
  } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  });
  
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MaintenanceStatus }) => 
      updateMaintenanceStatus(id, status),
    onSuccess: () => {
      toast({
        title: 'Statut mis à jour',
        description: 'Le statut de la maintenance a été mis à jour avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      queryClient.invalidateQueries({ queryKey: ['signalements'] });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        variant: 'destructive',
      });
    },
  });
  
  const handleStatusChange = (id: string, status: MaintenanceStatus) => {
    updateStatusMutation.mutate({ id, status });
  };
  
  const handleExportCSV = async () => {
    try {
      const csvData = await exportMaintenancesToCSV();
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'maintenances.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: 'Export réussi',
        description: 'Les données ont été exportées en format CSV',
      });
    } catch (error) {
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible d\'exporter les données',
        variant: 'destructive',
      });
    }
  };
  
  const filteredMaintenances = maintenances?.filter(maintenance => {
    if (statusFilter && maintenance.status !== statusFilter) {
      return false;
    }
    return true;
  });
  
  const getMaintenancesByMonth = () => {
    if (!maintenances) return {};
    
    const grouped: { [key: string]: any[] } = {};
    
    maintenances.forEach(maintenance => {
      const date = new Date(maintenance.scheduledDate);
      const month = date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
      
      if (!grouped[month]) {
        grouped[month] = [];
      }
      
      grouped[month].push(maintenance);
    });
    
    return grouped;
  };
  
  const getTeamName = (teamId: string) => {
    const team = teams?.find(t => t.id === teamId);
    return team ? team.name : 'Équipe inconnue';
  };
  
  const getStatusBadge = (status: MaintenanceStatus) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Planifiée</Badge>;
      case 'inProgress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Terminée</Badge>;
      default:
        return <Badge variant="outline">Inconnue</Badge>;
    }
  };
  
  const isLoading = isLoadingMaintenances || isLoadingTeams;
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Maintenances</h2>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1"
            onClick={handleExportCSV}
          >
            <FileDown className="h-4 w-4" /> Exporter CSV
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="h-8 gap-1"
              >
                <Plus className="h-4 w-4" /> Créer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer une maintenance</DialogTitle>
              </DialogHeader>
              
              <CreateMaintenanceForm
                onSuccess={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Liste</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <CardTitle>Liste des maintenances</CardTitle>
                  <CardDescription>
                    {isLoading ? 'Chargement des maintenances...' : 
                      `${filteredMaintenances?.length || 0} maintenances trouvées`}
                  </CardDescription>
                </div>
                
                <div className="mt-2 sm:mt-0">
                  <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="scheduled">Planifiées</SelectItem>
                      <SelectItem value="inProgress">En cours</SelectItem>
                      <SelectItem value="completed">Terminées</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                  ))}
                </div>
              ) : filteredMaintenances && filteredMaintenances.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Date planifiée</TableHead>
                        <TableHead>Équipe</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMaintenances.map((maintenance) => (
                        <TableRow key={maintenance.id} className={maintenance.id === highlightedId ? 'bg-muted/30' : ''}>
                          <TableCell className="font-medium">
                            {maintenance.title}
                          </TableCell>
                          <TableCell>
                            {new Date(maintenance.scheduledDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {getTeamName(maintenance.teamId)}
                          </TableCell>
                          <TableCell>
                            {maintenance.repairType}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(maintenance.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <Select 
                                value={maintenance.status}
                                onValueChange={(value) => handleStatusChange(
                                  maintenance.id, 
                                  value as MaintenanceStatus
                                )}
                                disabled={updateStatusMutation.isPending}
                              >
                                <SelectTrigger className="max-w-[130px]">
                                  <SelectValue placeholder="Changer statut" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="scheduled">Planifiée</SelectItem>
                                  <SelectItem value="inProgress">En cours</SelectItem>
                                  <SelectItem value="completed">Terminée</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Wrench className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Aucune maintenance trouvée</h3>
                  <p className="text-muted-foreground">
                    Essayez de modifier vos filtres ou créez une nouvelle maintenance
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des maintenances</CardTitle>
              <CardDescription>
                Vue calendrier des maintenances planifiées
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, index) => (
                    <Skeleton key={index} className="h-40 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(getMaintenancesByMonth()).map(([month, monthMaintenances]) => (
                    <div key={month} className="space-y-4">
                      <h3 className="text-lg font-semibold capitalize">{month}</h3>
                      <div className="space-y-2">
                        {monthMaintenances.map((maintenance) => {
                          const date = new Date(maintenance.scheduledDate);
                          return (
                            <Card key={maintenance.id} className={`border-l-4 ${
                              maintenance.status === 'completed' 
                                ? 'border-l-green-500' 
                                : maintenance.status === 'inProgress'
                                ? 'border-l-blue-500'
                                : 'border-l-orange-500'
                            } ${maintenance.id === highlightedId ? 'bg-muted/30' : ''}`}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium">{maintenance.title}</h4>
                                      {getStatusBadge(maintenance.status)}
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-4">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {date.toLocaleDateString('fr-FR', {
                                          weekday: 'long',
                                          day: 'numeric',
                                          month: 'long'
                                        })}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {maintenance.estimatedDuration} heure(s)
                                      </span>
                                    </div>
                                    <p className="text-sm">
                                      Équipe: {getTeamName(maintenance.teamId)}
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-start gap-2">
                                    {maintenance.status !== 'completed' && (
                                      <Select 
                                        value={maintenance.status}
                                        onValueChange={(value) => handleStatusChange(
                                          maintenance.id, 
                                          value as MaintenanceStatus
                                        )}
                                        disabled={updateStatusMutation.isPending}
                                      >
                                        <SelectTrigger className="h-8 text-xs">
                                          <SelectValue placeholder="Changer statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="scheduled">Planifiée</SelectItem>
                                          <SelectItem value="inProgress">En cours</SelectItem>
                                          <SelectItem value="completed">Terminée</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Maintenance;
