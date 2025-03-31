
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchSignalement, 
  updateSignalementStatus,
  fetchMaintenanceById
} from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertTriangle, 
  ArrowLeft, 
  Calendar, 
  Check, 
  MapPin, 
  Clock, 
  Share2,
  User, 
  Wrench 
} from 'lucide-react';
import { SignalementStatus } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import CreateMaintenanceForm from '@/components/CreateMaintenanceForm';

const SignalementDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);

  // Fetch signalement details
  const { 
    data: signalement, 
    isLoading, 
    error,
    isError,
    refetch
  } = useQuery({
    queryKey: ['signalement', id],
    queryFn: () => fetchSignalement(id || ''),
    enabled: !!id,
  });

  // Fetch related maintenance if exists
  const { 
    data: maintenance, 
    isLoading: isLoadingMaintenance 
  } = useQuery({
    queryKey: ['maintenance', signalement?.maintenanceId],
    queryFn: () => fetchMaintenanceById(signalement?.maintenanceId || ''),
    enabled: !!signalement?.maintenanceId,
  });

  // Mutation for updating signalement status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: SignalementStatus }) => 
      updateSignalementStatus(id, status),
    onSuccess: () => {
      toast({
        title: 'Statut mis à jour',
        description: 'Le statut du signalement a été mis à jour avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['signalement', id] });
      queryClient.invalidateQueries({ queryKey: ['signalements'] });
      refetch();
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        variant: 'destructive',
      });
    },
  });

  const handleStatusChange = (status: SignalementStatus) => {
    if (!signalement) return;
    updateStatusMutation.mutate({ id: signalement.id, status });
  };

  const getStatusBadge = (status: SignalementStatus) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Nouveau</Badge>;
      case 'inProgress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'repaired':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Réparé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-500">Élevée</Badge>;
      case 'medium':
        return <Badge className="bg-orange-500">Moyenne</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Faible</Badge>;
      default:
        return <Badge>Inconnue</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour
          </Button>
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !signalement) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-2xl font-bold mb-2">Signalement introuvable</h3>
        <p className="text-muted-foreground mb-6">
          Le signalement demandé n'existe pas ou a été supprimé.
        </p>
        <Button onClick={() => navigate('/signalements')}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          Signalement {signalement.id}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <div className="relative h-[400px]">
            <img 
              src={signalement.imageUrl} 
              alt="Nid-de-poule" 
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{signalement.address}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Détails du signalement</CardTitle>
              <CardDescription>
                Informations détaillées sur ce nid-de-poule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <div className="mt-1">{getStatusBadge(signalement.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gravité</p>
                  <div className="mt-1">{getSeverityBadge(signalement.severity)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date de signalement</p>
                  <p className="font-medium flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {new Date(signalement.reportDate).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Détecté par</p>
                  <p className="font-medium flex items-center mt-1">
                    {signalement.detectedBy === 'ai' ? (
                      <>
                        <Share2 className="h-4 w-4 mr-2 text-muted-foreground" />
                        Intelligence artificielle
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        Utilisateur
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Coordonnées GPS</p>
                <p className="font-medium flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  {signalement.coordinates.lat.toFixed(6)}, {signalement.coordinates.lng.toFixed(6)}
                </p>
              </div>

              {signalement.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="mt-1">{signalement.description}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6 items-center">
              <div className="flex gap-2">
                <Button
                  variant={signalement.status === 'new' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('new')}
                  disabled={signalement.status === 'new' || updateStatusMutation.isPending}
                >
                  Nouveau
                </Button>
                <Button
                  variant={signalement.status === 'inProgress' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('inProgress')}
                  disabled={signalement.status === 'inProgress' || updateStatusMutation.isPending}
                >
                  En cours
                </Button>
                <Button
                  variant={signalement.status === 'repaired' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('repaired')}
                  disabled={signalement.status === 'repaired' || updateStatusMutation.isPending}
                >
                  Réparé
                </Button>
              </div>
              
              {!signalement.maintenanceId && (
                <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Wrench className="h-4 w-4 mr-2" />
                      Planifier une maintenance
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Planifier une maintenance</DialogTitle>
                      <DialogDescription>
                        Créez une nouvelle tâche de maintenance pour ce signalement
                      </DialogDescription>
                    </DialogHeader>
                    
                    <CreateMaintenanceForm 
                      signalementId={signalement.id}
                      onSuccess={() => {
                        setIsMaintenanceDialogOpen(false);
                        refetch();
                      }}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </CardFooter>
          </Card>

          {signalement.maintenanceId && maintenance && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" /> Maintenance associée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Titre</p>
                    <p className="font-medium">{maintenance.title}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Statut</p>
                      <Badge 
                        variant="outline" 
                        className={
                          maintenance.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : maintenance.status === 'inProgress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }
                      >
                        {maintenance.status === 'completed' 
                          ? 'Terminée' 
                          : maintenance.status === 'inProgress'
                          ? 'En cours'
                          : 'Planifiée'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date planifiée</p>
                      <p className="font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {new Date(maintenance.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Type de réparation</p>
                    <p className="font-medium">{maintenance.repairType}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Durée estimée</p>
                    <p className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {maintenance.estimatedDuration} heure(s)
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/maintenance?id=${maintenance.id}`}>
                  <Button variant="outline">
                    Voir les détails de la maintenance
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignalementDetails;
