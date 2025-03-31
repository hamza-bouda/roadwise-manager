
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchSignalements, filterSignalements } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Calendar, Eye, FileDown, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SignalementStatus } from '@/types';
import { exportSignalementsToCSV } from '@/services/dataService';

const SignalementsList = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    dateFrom: '',
    dateTo: '',
  });

  const { data: signalements, isLoading, refetch } = useQuery({
    queryKey: ['signalements', filters],
    queryFn: () => filters.status || filters.severity || filters.dateFrom || filters.dateTo 
      ? filterSignalements(filters) 
      : fetchSignalements(),
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      severity: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const handleExportCSV = async () => {
    try {
      const csvData = await exportSignalementsToCSV();
      
      // Créer un blob et générer un lien de téléchargement
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'signalements.csv');
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

  const getStatusBadge = (status: SignalementStatus) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">Nouveau</Badge>;
      case 'inProgress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">En cours</Badge>;
      case 'repaired':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Réparé</Badge>;
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Signalements</h2>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1"
            onClick={handleExportCSV}
          >
            <FileDown className="h-4 w-4" /> Exporter CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Filtres</CardTitle>
              <CardDescription>Filtrer les signalements par différents critères</CardDescription>
            </div>
            {(filters.status || filters.severity || filters.dateFrom || filters.dateTo) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearFilters}
                className="h-8 gap-1"
              >
                <X className="h-4 w-4" /> Effacer
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="new">Nouveau</SelectItem>
                  <SelectItem value="inProgress">En cours</SelectItem>
                  <SelectItem value="repaired">Réparé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="severity">Gravité</Label>
              <Select 
                value={filters.severity} 
                onValueChange={(value) => handleFilterChange('severity', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les gravités" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les gravités</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Date début</Label>
              <Input 
                id="dateFrom" 
                type="date" 
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateTo">Date fin</Label>
              <Input 
                id="dateTo" 
                type="date" 
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des signalements</CardTitle>
          <CardDescription>
            {isLoading 
              ? 'Chargement des signalements...' 
              : `${signalements?.length || 0} signalements trouvés`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : signalements && signalements.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Gravité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {signalements.map((signalement) => (
                    <TableRow key={signalement.id}>
                      <TableCell>
                        <div className="h-14 w-14 rounded-md overflow-hidden">
                          <img 
                            src={signalement.thumbnailUrl} 
                            alt="Nid-de-poule" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{signalement.address}</TableCell>
                      <TableCell>
                        {new Date(signalement.reportDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getSeverityBadge(signalement.severity)}</TableCell>
                      <TableCell>{getStatusBadge(signalement.status)}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/signalements/${signalement.id}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Aucun signalement trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos filtres ou revenez plus tard
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignalementsList;
