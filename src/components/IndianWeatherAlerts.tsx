import React, { useState } from 'react';
import { EditableField } from './ui/editable-field';
import { EditableTable, Column } from './ui/editable-table';
import { CloudLightning, CloudRain, Wind, Thermometer, Sun, AlertTriangle, Filter, Calendar, PlusCircle, ArrowDown, ArrowUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface WeatherAlert {
  id: number;
  date: string;
  type: 'Heavy rainfall' | 'Tempête tropicale' | 'Drought' | 'Chaleur excessive' | 'Inondation';
  region: string;
  severity: 'Basse' | 'Average' | 'High' | 'Extrême';
  impactCrops: 'Low' | 'Modéré' | 'Sévère';
  description: string;
  recommendation: string;
  status: 'Active' | 'Completede' | 'Prévue';
}

const alertFormSchema = z.object({
  date: z.string().min(1, { message: "La date est requise" }),
  type: z.enum(['Heavy rainfall', 'Tempête tropicale', 'Drought', 'Chaleur excessive', 'Inondation']),
  region: z.string().min(1, { message: "La région est requise" }),
  severity: z.enum(['Basse', 'Average', 'High', 'Extrême']),
  impactCrops: z.enum(['Low', 'Modéré', 'Sévère']),
  description: z.string().min(5, { message: "Description trop courte" }),
  recommendation: z.string().min(5, { message: "Recommandation trop courte" }),
  status: z.enum(['Active', 'Completede', 'Prévue']),
});

const IndianWeatherAlerts = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('Weather Alerts in India');
  const [description, setDescription] = useState('Track weather alerts impacting crops and prepare your preventive actions');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedAlertId, setExpandedAlertId] = useState<number | null>(null);
  
  const form = useForm<z.infer<typeof alertFormSchema>>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      type: 'Heavy rainfall',
      region: 'Maharashtra',
      severity: 'Average',
      impactCrops: 'Modéré',
      description: '',
      recommendation: '',
      status: 'Active',
    },
  });
  
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([
    {
      id: 1,
      date: '2024-06-15',
      type: 'Heavy rainfall',
      region: 'Maharashtra',
      severity: 'High',
      impactCrops: 'Modéré',
      description: 'Heavy precipitation attendues durant 48 heures avec risque d\'inondation dans les zones of basse altitude.',
      recommendation: 'Vérifier le drainage des parcelles et protéger les jeunes seedlings. Suspendre temporairement l\'irrigation.',
      status: 'Active'
    },
    {
      id: 2,
      date: '2024-06-20',
      type: 'Tempête tropicale',
      region: 'Grande-Terre',
      severity: 'Extrême',
      impactCrops: 'Sévère',
      description: 'Tempête tropicale Emily approchant avec des vents pouvant dépasser 120 km/h et fortes précipitations.',
      recommendation: 'Harvest mature crops preventively. Strengthen banana plant supports. Secure agricultural equipment.',
      status: 'Prévue'
    },
    {
      id: 3,
      date: '2024-05-25',
      type: 'Drought',
      region: 'Grande-Terre',
      severity: 'Average',
      impactCrops: 'Modéré',
      description: 'Période prolongée sans précipitations significatives causant un stress hydrique pour certaines cultures.',
      recommendation: 'Prioriser l\'irrigation des cultures sensibles. Utiliser du paillage pour conserver l\'humidité du sol.',
      status: 'Completede'
    },
    {
      id: 4,
      date: '2024-07-05',
      type: 'Chaleur excessive',
      region: 'Les Saintes',
      severity: 'Average',
      impactCrops: 'Modéré',
      description: 'Vague of chaleur avec températures dépassant 35°C pendant plusieurs jours consécutifs.',
      recommendation: 'Ombrager les cultures sensibles. Augmenter la fréquence d\'irrigation, of préférence tôt le matin ou tard le soir.',
      status: 'Prévue'
    },
    {
      id: 5,
      date: '2024-06-10',
      type: 'Inondation',
      region: 'Maharashtra',
      severity: 'High',
      impactCrops: 'Sévère',
      description: 'Débordement des rivières suite aux pluies intenses des derniers jours affectant les parcelles en zone basse.',
      recommendation: 'Évacuer les cultures pouvant être récoltées. Préparer les demandes d\'indemnisation. Surveiller les maladies fongiques.',
      status: 'Completede'
    }
  ]);
  
  const columns: Column[] = [
    { id: 'date', header: 'Date', accessorKey: 'date', isEditable: true },
    { id: 'type', header: 'Type d\'alerte', accessorKey: 'type', isEditable: true },
    { id: 'region', header: 'Région', accessorKey: 'region', isEditable: true },
    { id: 'severity', header: 'Sévérité', accessorKey: 'severity', isEditable: true },
    { id: 'status', header: 'Status', accessorKey: 'status', isEditable: true },
  ];
  
  const handleTitleChange = (value: string | number) => {
    setTitle(String(value));
    toast({
      title: "Titre mis à jour",
      description: "Le titre du module a été modifié avec succès"
    });
  };
  
  const handleDescriptionChange = (value: string | number) => {
    setDescription(String(value));
    toast({
      title: "Description mise à jour",
      description: "La description du module a été modifiée avec succès"
    });
  };
  
  const filteredAlerts = weatherAlerts.filter(alert => {
    const matchesSearch = 
      alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.recommendation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });
  
  const handleTableUpdate = (rowIndex: number, columnId: string, value: any) => {
    const newData = [...weatherAlerts];
    const itemId = filteredAlerts[rowIndex].id;
    const dataIndex = newData.findIndex(item => item.id === itemId);
    
    if (dataIndex !== -1) {
      const updatedItem = { ...newData[dataIndex], [columnId]: value };
      newData[dataIndex] = updatedItem;
      setWeatherAlerts(newData);
      
      toast({
        title: "Alert mise à jour",
        description: `Les informations of l'alerte ont été mises à jour`
      });
    }
  };
  
  const handleDeleteRow = (rowIndex: number) => {
    const itemId = filteredAlerts[rowIndex].id;
    const newData = weatherAlerts.filter(item => item.id !== itemId);
    setWeatherAlerts(newData);
    
    toast({
      title: "Alert supprimée",
      description: "L'alerte a été supprimée avec succès"
    });
  };
  
  const onSubmit = (data: z.infer<typeof alertFormSchema>) => {
    const newId = Math.max(0, ...weatherAlerts.map(item => item.id)) + 1;
    
    const newAlert: WeatherAlert = {
      id: newId,
      date: data.date,
      type: data.type,
      region: data.region,
      severity: data.severity,
      impactCrops: data.impactCrops,
      description: data.description,
      recommendation: data.recommendation,
      status: data.status
    };
    
    setWeatherAlerts([...weatherAlerts, newAlert]);
    setDialogOpen(false);
    form.reset();
    
    toast({
      title: "Alert ajoutée",
      description: `Nouvelle alerte météo ajoutée pour ${data.region}`
    });
  };
  
  const handleExpandAlert = (id: number) => {
    setExpandedAlertId(expandedAlertId === id ? null : id);
  };
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'Heavy rainfall':
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'Tempête tropicale':
        return <Wind className="h-6 w-6 text-purple-500" />;
      case 'Drought':
        return <Sun className="h-6 w-6 text-orange-500" />;
      case 'Chaleur excessive':
        return <Thermometer className="h-6 w-6 text-red-500" />;
      case 'Inondation':
        return <CloudLightning className="h-6 w-6 text-indigo-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-500" />;
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Basse':
        return 'bg-green-100 text-green-800';
      case 'Average':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Extrême':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-800';
      case 'Completede':
        return 'bg-gray-100 text-gray-800';
      case 'Prévue':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <CloudLightning className="h-6 w-6 mr-2 text-purple-500" />
            <EditableField
              value={title}
              onSave={handleTitleChange}
              className="inline-block"
            />
          </h2>
          <p className="text-muted-foreground">
            <EditableField
              value={description}
              onSave={handleDescriptionChange}
              className="inline-block"
            />
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="relative flex-grow max-w-sm">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search une alerte..."
              className="pl-10"
            />
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-[150px]">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sévérité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="Basse">Basse</SelectItem>
              <SelectItem value="Average">Average</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Extrême">Extrême</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completede">Completede</SelectItem>
              <SelectItem value="Prévue">Prévue</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="ml-auto">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nouvelle alerte
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add une nouvelle alerte météo</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type d'alerte</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Heavy rainfall">Heavy rainfall</SelectItem>
                                <SelectItem value="Tempête tropicale">Tempête tropicale</SelectItem>
                                <SelectItem value="Drought">Drought</SelectItem>
                                <SelectItem value="Chaleur excessive">Chaleur excessive</SelectItem>
                                <SelectItem value="Inondation">Inondation</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Région</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner une région" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                <SelectItem value="Grande-Terre">Grande-Terre</SelectItem>
                                <SelectItem value="Marie-Galante">Marie-Galante</SelectItem>
                                <SelectItem value="Les Saintes">Les Saintes</SelectItem>
                                <SelectItem value="La Désirade">La Désirade</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="severity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sévérité</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner une sévérité" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Basse">Basse</SelectItem>
                                <SelectItem value="Average">Average</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Extrême">Extrême</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="impactCrops"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Impact of les cultures</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un impact" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Modéré">Modéré</SelectItem>
                                <SelectItem value="Sévère">Sévère</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un statut" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Completede">Completede</SelectItem>
                                <SelectItem value="Prévue">Prévue</SelectItem>
                              </SelectContent>
                            </Select>
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
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="recommendation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recommandation</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-muted/30">
              <AlertTriangle className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Aucune alerte ne correspond aux critères of recherche</p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div 
                key={alert.id} 
                className="border rounded-lg overflow-hidden hover:border-blue-200 transition-all"
              >
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => handleExpandAlert(alert.id)}
                >
                  <div className="flex items-center space-x-4">
                    {getAlertIcon(alert.type)}
                    <div>
                      <h3 className="font-semibold">{alert.type} - {alert.region}</h3>
                      <p className="text-sm text-muted-foreground">{new Date(alert.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status}
                    </Badge>
                    {expandedAlertId === alert.id ? (
                      <ArrowUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                {expandedAlertId === alert.id && (
                  <div className="p-4 bg-muted/20 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Description</h4>
                        <p className="text-sm">{alert.description}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Recommandations</h4>
                        <p className="text-sm">{alert.recommendation}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-1">Impact of les cultures</h4>
                      <Badge className={alert.impactCrops === 'Sévère' ? 'bg-red-100 text-red-800' : 
                                      alert.impactCrops === 'Modéré' ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-green-100 text-green-800'}>
                        {alert.impactCrops}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <h3 className="text-lg font-semibold p-4 bg-muted/20 border-b">Manage les alertes</h3>
          <EditableTable
            data={filteredAlerts}
            columns={columns}
            onUpdate={handleTableUpdate}
            onDelete={handleDeleteRow}
            sortable={true}
            className="border-none"
          />
        </div>
      </div>
    </div>
  );
};

export default IndianWeatherAlerts;
