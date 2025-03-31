
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSaveGeneral = () => {
    toast({
      title: 'Paramètres enregistrés',
      description: 'Les paramètres généraux ont été mis à jour',
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: 'Paramètres de notifications mis à jour',
      description: 'Vos préférences de notifications ont été enregistrées',
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Gérez les paramètres généraux de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode">Mode sombre</Label>
                    <p className="text-sm text-muted-foreground">
                      Activer le thème sombre pour l'interface
                    </p>
                  </div>
                  <Switch id="dark-mode" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-refresh">Actualisation automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Actualiser automatiquement les données toutes les 5 minutes
                    </p>
                  </div>
                  <Switch id="auto-refresh" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-export">Export automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Exporter automatiquement les données chaque nuit
                    </p>
                  </div>
                  <Switch id="auto-export" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="export-path">Chemin d'export</Label>
                  <Input id="export-path" placeholder="/home/user/exports" />
                </div>
              </div>

              <Button onClick={handleSaveGeneral}>Enregistrer les paramètres</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notifications</CardTitle>
              <CardDescription>
                Gérez vos préférences de notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications par email
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="new-pothole">Nouveaux nids-de-poule</Label>
                    <p className="text-sm text-muted-foreground">
                      Être notifié pour chaque nouveau signalement
                    </p>
                  </div>
                  <Switch id="new-pothole" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-due">Rappels de maintenance</Label>
                    <p className="text-sm text-muted-foreground">
                      Rappels pour les maintenances planifiées
                    </p>
                  </div>
                  <Switch id="maintenance-due" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="status-updates">Mises à jour de statut</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications lors des changements de statut
                    </p>
                  </div>
                  <Switch id="status-updates" />
                </div>
              </div>

              <Button onClick={handleSaveNotifications}>Enregistrer les préférences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Information du profil</CardTitle>
              <CardDescription>
                Mettez à jour vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Input id="role" defaultValue={user?.role} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea id="bio" placeholder="Votre biographie professionnelle" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Changer le mot de passe</Label>
                  <Input id="password" type="password" placeholder="Nouveau mot de passe" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-confirm">Confirmer le mot de passe</Label>
                  <Input id="password-confirm" type="password" placeholder="Confirmer le mot de passe" />
                </div>
              </div>

              <Button>Enregistrer le profil</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
