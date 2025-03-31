
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSignalements } from '@/services/dataService';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin } from 'lucide-react';
import { Signalement, SignalementStatus } from '@/types';

const Map = () => {
  const { data: signalements, isLoading } = useQuery({
    queryKey: ['signalements'],
    queryFn: fetchSignalements,
  });

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [activeMarker, setActiveMarker] = useState<Signalement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filtrer les signalements basés sur le statut et la date
  const filteredSignalements = signalements?.filter(signalement => {
    // Filtrage par statut
    if (statusFilter && signalement.status !== statusFilter) {
      return false;
    }

    // Filtrage par date
    if (dateFilter !== 'all') {
      const reportDate = new Date(signalement.reportDate);
      const now = new Date();
      
      if (dateFilter === 'today') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return reportDate >= today;
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return reportDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return reportDate >= monthAgo;
      }
    }

    return true;
  });

  // Aides pour l'affichage du statut
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

  // Rendu de la placeholder de carte (implémentation fictive)
  // Dans une vraie application, cela utiliserait une bibliothèque comme Mapbox ou Leaflet
  const renderMapPlaceholder = () => (
    <div className="relative bg-gray-200 rounded-lg h-[600px] flex items-center justify-center text-gray-500 overflow-hidden">
      {isLoading ? (
        <Skeleton className="h-full w-full" />
      ) : (
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ 
            backgroundImage: 'url("https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/[-6.8498,33.9716,10]/800x600?access_token=pk.eyJ1IjoibG92YWJsZWNvIiwiYSI6ImNsc2EzYTBnMTA3bHkya29reXJ0Mm91cmsifQ.nNsLrHtFrgqiFAKJ9R9tJg")', 
            opacity: 0.7
          }} />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          
          <div className="absolute z-10 text-center">
            <p className="mb-3 text-white font-bold">Carte interactive des signalements</p>
            <p className="text-white/80 text-sm max-w-lg">
              Cette démo montre comment les signalements seraient affichés sur une carte. 
              Dans l'application finale, une intégration de carte réelle serait utilisée.
            </p>
          </div>
          
          {filteredSignalements?.map((signalement) => (
            <div 
              key={signalement.id}
              className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
              style={{ 
                left: `${30 + (signalement.coordinates.lng + 9.5) * 12}%`, 
                top: `${20 + (signalement.coordinates.lat - 31.5) * 40}%` 
              }}
              onClick={() => {
                setActiveMarker(signalement);
                setIsDialogOpen(true);
              }}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                signalement.status === 'repaired' 
                  ? 'bg-green-500' 
                  : signalement.status === 'inProgress' 
                  ? 'bg-blue-500' 
                  : 'bg-red-500'
              }`}>
                <MapPin className="h-4 w-4 text-white" />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Carte des signalements</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <CardTitle>Filtres</CardTitle>
              <CardDescription>Filtrer les signalements sur la carte</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="new">Nouveaux</SelectItem>
                  <SelectItem value="inProgress">En cours</SelectItem>
                  <SelectItem value="repaired">Réparés</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Période</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les dates</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Carte interactive</CardTitle>
          <CardDescription>
            {isLoading ? 'Chargement de la carte...' : 
              `${filteredSignalements?.length || 0} signalements affichés`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderMapPlaceholder()}
          
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">Nouveaux</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm">En cours</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">Réparés</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogue pour afficher les détails du marqueur */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Détails du signalement</DialogTitle>
          </DialogHeader>
          {activeMarker && (
            <div className="space-y-4">
              <div className="h-[200px] rounded-md overflow-hidden">
                <img 
                  src={activeMarker.imageUrl} 
                  alt="Nid-de-poule" 
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Statut</p>
                    <div>{getStatusBadge(activeMarker.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gravité</p>
                    <div>{getSeverityBadge(activeMarker.severity)}</div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="font-medium">{activeMarker.address}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(activeMarker.reportDate).toLocaleDateString()}</p>
                </div>
                
                <Link to={`/signalements/${activeMarker.id}`} className="block">
                  <Button className="w-full">Voir détails complets</Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Map;
