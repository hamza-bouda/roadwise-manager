
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSignalements, fetchTeams, createMaintenance } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MaintenanceStatus } from '@/types';

// Schema de validation pour le formulaire
const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Le titre doit contenir au moins 5 caractères',
  }),
  description: z.string().optional(),
  scheduledDate: z.string().min(1, {
    message: 'La date de planification est requise',
  }),
  status: z.enum(['scheduled', 'inProgress', 'completed']),
  teamId: z.string().min(1, {
    message: 'Une équipe doit être sélectionnée',
  }),
  signalementIds: z.array(z.string()).min(1, {
    message: 'Au moins un signalement doit être sélectionné',
  }),
  repairType: z.string().min(1, {
    message: 'Le type de réparation est requis',
  }),
  estimatedDuration: z.string().transform(Number).refine(val => !isNaN(val) && val > 0, {
    message: 'La durée estimée doit être un nombre positif',
  }),
  notes: z.string().optional(),
});

type Props = {
  signalementId?: string;
  onSuccess?: () => void;
};

const CreateMaintenanceForm = ({ signalementId, onSuccess }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  
  // Récupérer les signalements
  const { data: signalements, isLoading: isLoadingSignalements } = useQuery({
    queryKey: ['signalements'],
    queryFn: fetchSignalements,
  });
  
  // Récupérer les équipes
  const { data: teams, isLoading: isLoadingTeams } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  });
  
  // Mutation pour créer une maintenance
  const createMaintenanceMutation = useMutation({
    mutationFn: createMaintenance,
    onSuccess: () => {
      toast({
        title: 'Maintenance créée',
        description: 'La tâche de maintenance a été créée avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      queryClient.invalidateQueries({ queryKey: ['signalements'] });
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la maintenance',
        variant: 'destructive',
      });
    },
  });
  
  // Initialiser le formulaire
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      status: 'scheduled' as MaintenanceStatus,
      teamId: '',
      signalementIds: signalementId ? [signalementId] : [],
      repairType: 'Remplissage',
      estimatedDuration: '2',
      notes: '',
    },
  });
  
  // Soumettre le formulaire
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createMaintenanceMutation.mutate({
      ...values,
      estimatedDuration: Number(values.estimatedDuration),
    });
  };
  
  const isLoading = isLoadingSignalements || isLoadingTeams || createMaintenanceMutation.isPending;
  
  // Filtrer les signalements qui n'ont pas déjà une maintenance assignée
  const availableSignalements = signalements?.filter(s => !s.maintenanceId || s.id === signalementId) || [];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input placeholder="Titre de la maintenance" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="scheduledDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date planifiée</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="scheduled">Planifiée</SelectItem>
                    <SelectItem value="inProgress">En cours</SelectItem>
                    <SelectItem value="completed">Terminée</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="teamId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Équipe</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une équipe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teams?.map(team => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name} ({team.specialization})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="repairType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de réparation</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Remplissage">Remplissage</SelectItem>
                    <SelectItem value="Resurfaçage">Resurfaçage</SelectItem>
                    <SelectItem value="Réparation complète">Réparation complète</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="estimatedDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durée estimée (heures)</FormLabel>
                <FormControl>
                  <Input type="number" min="0.5" step="0.5" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="signalementIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Signalements</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={isLoading || availableSignalements.length === 0}
                      >
                        {field.value.length > 0
                          ? `${field.value.length} signalement(s) sélectionné(s)`
                          : "Sélectionner les signalements"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Rechercher un signalement..." />
                      <CommandEmpty>Aucun signalement trouvé.</CommandEmpty>
                      <CommandList>
                        <ScrollArea className="h-60">
                          <CommandGroup>
                            {availableSignalements.map((signalement) => (
                              <CommandItem
                                key={signalement.id}
                                value={signalement.id}
                                onSelect={() => {
                                  const currentValue = field.value || [];
                                  const newValue = currentValue.includes(signalement.id)
                                    ? currentValue.filter(id => id !== signalement.id)
                                    : [...currentValue, signalement.id];
                                  field.onChange(newValue);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value?.includes(signalement.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-md overflow-hidden mr-2">
                                      <img 
                                        src={signalement.thumbnailUrl} 
                                        alt="Nid-de-poule" 
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-sm">{signalement.address}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(signalement.reportDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </ScrollArea>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Sélectionnez les signalements à inclure dans cette maintenance.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Description de la tâche de maintenance" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes supplémentaires</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Notes supplémentaires" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Création...' : 'Créer la maintenance'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateMaintenanceForm;
