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
  type: 'Heavy rainfall' | 'Tropical storm' | 'Drought' | 'Excessive heat' | 'Flooding';
  region: string;
  severity: 'Low' | 'Average' | 'High' | 'Extreme';
  impactCrops: 'Low' | 'Moderate' | 'Severe';
  description: string;
  recommendation: string;
  status: 'Active' | 'Completed' | 'Planned';
}

const alertFormSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  type: z.enum(['Heavy rainfall', 'Tropical storm', 'Drought', 'Excessive heat', 'Flooding']),
  region: z.string().min(1, { message: "Region is required" }),
  severity: z.enum(['Low', 'Average', 'High', 'Extreme']),
  impactCrops: z.enum(['Low', 'Moderate', 'Severe']),
  description: z.string().min(5, { message: "Description too short" }),
  recommendation: z.string().min(5, { message: "Recommendation too short" }),
  status: z.enum(['Active', 'Completed', 'Planned']),
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
      impactCrops: 'Moderate',
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
      impactCrops: 'Moderate',
      description: 'Heavy precipitation expected for 48 hours with risk of flooding in low-lying areas.',
      recommendation: 'Check field drainage and protect young seedlings. Temporarily suspend irrigation.',
      status: 'Active'
    },
    {
      id: 2,
      date: '2024-06-20',
      type: 'Tropical storm',
      region: 'Punjab',
      severity: 'Extreme',
      impactCrops: 'Severe',
      description: 'Tropical storm Emily approaching with winds exceeding 120 km/h and heavy precipitation.',
      recommendation: 'Harvest mature crops preventively. Strengthen banana plant supports. Secure agricultural equipment.',
      status: 'Planned'
    },
    {
      id: 3,
      date: '2024-05-25',
      type: 'Drought',
      region: 'Punjab',
      severity: 'Average',
      impactCrops: 'Moderate',
      description: 'Extended period without significant precipitation causing water stress for some crops.',
      recommendation: 'Prioritize irrigation of sensitive crops. Use mulching to conserve soil moisture.',
      status: 'Completed'
    },
    {
      id: 4,
      date: '2024-07-05',
      type: 'Excessive heat',
      region: 'Maharashtra',
      severity: 'Average',
      impactCrops: 'Moderate',
      description: 'Heat wave with temperatures exceeding 35°C for several consecutive days.',
      recommendation: 'Shade sensitive crops. Increase irrigation frequency, preferably early morning or late evening.',
      status: 'Planned'
    },
    {
      id: 5,
      date: '2024-06-10',
      type: 'Flooding',
      region: 'Maharashtra',
      severity: 'High',
      impactCrops: 'Severe',
      description: 'River overflow following intense rains in recent days affecting low-lying fields.',
      recommendation: 'Evacuate harvestable crops. Prepare compensation claims. Monitor fungal diseases.',
      status: 'Completed'
    }
  ]);
  
  const columns: Column[] = [
    { id: 'date', header: 'Date', accessorKey: 'date', isEditable: true },
    { id: 'type', header: 'Alert Type', accessorKey: 'type', isEditable: true },
    { id: 'region', header: 'Region', accessorKey: 'region', isEditable: true },
    { id: 'severity', header: 'Severity', accessorKey: 'severity', isEditable: true },
    { id: 'status', header: 'Status', accessorKey: 'status', isEditable: true },
  ];
  
  const handleTitleChange = (value: string | number) => {
    setTitle(String(value));
    toast({
      title: "Title updated",
      description: "Module title has been successfully modified"
    });
  };
  
  const handleDescriptionChange = (value: string | number) => {
    setDescription(String(value));
    toast({
      title: "Description updated",
      description: "Module description has been successfully modified"
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
        title: "Alert updated",
        description: `Alert information has been updated`
      });
    }
  };
  
  const handleDeleteRow = (rowIndex: number) => {
    const itemId = filteredAlerts[rowIndex].id;
    const newData = weatherAlerts.filter(item => item.id !== itemId);
    setWeatherAlerts(newData);
    
    toast({
      title: "Alert deleted",
      description: "Alert has been successfully deleted"
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
      title: "Alert added",
      description: `New weather alert added for ${data.region}`
    });
  };
  
  const handleExpandAlert = (id: number) => {
    setExpandedAlertId(expandedAlertId === id ? null : id);
  };
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'Heavy rainfall':
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'Tropical storm':
        return <Wind className="h-6 w-6 text-purple-500" />;
      case 'Drought':
        return <Sun className="h-6 w-6 text-orange-500" />;
      case 'Excessive heat':
        return <Thermometer className="h-6 w-6 text-red-500" />;
      case 'Flooding':
        return <CloudLightning className="h-6 w-6 text-indigo-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Average':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Extreme':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Planned':
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
          <div className="text-muted-foreground">
            <EditableField
              value={description}
              onSave={handleDescriptionChange}
              className=""
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="relative flex-grow max-w-sm">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search an alert..."
              className="pl-10"
            />
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-[150px]">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Average">Average</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Extreme">Extreme</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Planned">Planned</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="ml-auto">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Alert
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add a new weather alert</DialogTitle>
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
                            <FormLabel>Alert Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Heavy rainfall">Heavy rainfall</SelectItem>
                                <SelectItem value="Tropical storm">Tropical storm</SelectItem>
                                <SelectItem value="Drought">Drought</SelectItem>
                                <SelectItem value="Excessive heat">Excessive heat</SelectItem>
                                <SelectItem value="Flooding">Flooding</SelectItem>
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
                            <FormLabel>Region</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a region" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                <SelectItem value="Punjab">Punjab</SelectItem>
                                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                                <SelectItem value="Gujarat">Gujarat</SelectItem>
                                <SelectItem value="Karnataka">Karnataka</SelectItem>
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
                            <FormLabel>Severity</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a severity" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Average">Average</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Extreme">Extreme</SelectItem>
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
                            <FormLabel>Impact on crops</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an impact" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Moderate">Moderate</SelectItem>
                                <SelectItem value="Severe">Severe</SelectItem>
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
                                  <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Planned">Planned</SelectItem>
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
                          <FormLabel>Recommendation</FormLabel>
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
              <p className="text-muted-foreground">No alerts match your search criteria</p>
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
                        <h4 className="text-sm font-semibold mb-1">Recommendations</h4>
                        <p className="text-sm">{alert.recommendation}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-1">Impact on crops</h4>
                      <Badge className={alert.impactCrops === 'Severe' ? 'bg-red-100 text-red-800' :
                                      alert.impactCrops === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
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
          <h3 className="text-lg font-semibold p-4 bg-muted/20 border-b">Manage alerts</h3>
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