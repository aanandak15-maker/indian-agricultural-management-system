import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit,
  Sprout,
  ArrowRight,
  Check,
  X,
  Save
} from 'lucide-react';
import { EditableField } from './ui/editable-field';
import { EditableTable, Column } from './ui/editable-table';
import { toast } from 'sonner';

// Define the string literal types first to enofe type safety
type CropStatus = 'growing' | 'harvested' | 'planned';
type TaskPriority = 'high' | 'medium' | 'low';

// Mock data for crop planning - Adapte a l'agriculture en India
const initialCropsData = [
  { 
    id: 1, 
    name: 'Sugarcane', 
    variety: 'R579', 
    parcel: 'North Punjab', 
    plantingDate: '2023-02-15', 
    harvestDate: '2024-02-15', 
    status: 'growing' as CropStatus,
    area: 15.5 
  },
  { 
    id: 2, 
    name: 'Cotton', 
    variety: 'Poyo', 
    parcel: 'Maharashtra Sud', 
    plantingDate: '2023-04-10', 
    harvestDate: '2023-12-10', 
    status: 'growing' as CropStatus,
    area: 8.3
  },
  { 
    id: 3, 
    name: 'Rice', 
    variety: 'Bouteille', 
    parcel: 'Capesterre', 
    plantingDate: '2023-05-20', 
    harvestDate: '2024-01-20', 
    status: 'growing' as CropStatus,
    area: 4.7 
  },
  { 
    id: 4, 
    name: 'Wheat', 
    variety: 'Pacala', 
    parcel: 'Nord Punjab', 
    plantingDate: '2023-09-15', 
    harvestDate: '2024-03-15', 
    status: 'planned' as CropStatus,
    area: 5.2 
  },
  { 
    id: 5, 
    name: 'Cotton', 
    variety: 'Blanche', 
    parcel: 'Tamil Nadu', 
    plantingDate: '2023-04-01', 
    harvestDate: '2023-11-01', 
    status: 'growing' as CropStatus,
    area: 3.8 
  }
];

// Tasks related to crops - Adapte au contexte guaofloupeen
const initialCropTasks = [
  { id: 1, cropId: 1, title: 'Sugarcane fertilization', date: '2023-09-25', completed: false, priority: 'high' as TaskPriority },
  { id: 2, cropId: 2, title: 'Treatment against leaf spot disease', date: '2023-09-28', completed: false, priority: 'medium' as TaskPriority },
  { id: 3, cropId: 3, title: 'Pineapple growth inspection', date: '2023-09-30', completed: false, priority: 'low' as TaskPriority },
  { id: 4, cropId: 5, title: 'Cotton field weeding', date: '2023-10-05', completed: false, priority: 'medium' as TaskPriority },
  { id: 5, cropId: 1, title: 'Sugarcane cutting preparation', date: '2024-01-10', completed: false, priority: 'high' as TaskPriority }
];

// Monthly calendar view mock data - Adapte a l'agriculture guaofloupeenne
const monthlyEvents = [
  { date: '2023-09-25', events: [{ id: 1, title: 'Sugarcane fertilization', crop: 'Sugarcane', priority: 'high' }] },
  { date: '2023-09-28', events: [{ id: 2, title: 'Treatment against leaf spot disease', crop: 'Cotton', priority: 'medium' }] },
  { date: '2023-09-30', events: [{ id: 3, title: 'Pineapple growth inspection', crop: 'Rice', priority: 'low' }] },
  { date: '2023-10-05', events: [{ id: 4, title: 'Cotton field weeding', crop: 'Cotton', priority: 'medium' }] },
  { date: '2024-01-10', events: [{ id: 5, title: 'Sugarcane cutting preparation', crop: 'Sugarcane', priority: 'high' }] },
  { date: '2023-12-10', events: [{ id: 6, title: 'Harvest', crop: 'Cotton', priority: 'high' }] },
  { date: '2024-01-20', events: [{ id: 7, title: 'Harvest', crop: 'Rice', priority: 'high' }] },
  { date: '2023-11-01', events: [{ id: 8, title: 'Harvest', crop: 'Cotton', priority: 'medium' }] },
  { date: '2024-02-15', events: [{ id: 9, title: 'Sugarcane cutting', crop: 'Sugarcane', priority: 'high' }] }
];

interface CropData {
  id: number;
  name: string;
  variety: string;
  parcel: string;
  plantingDate: string;
  harvestDate: string;
  status: CropStatus;
  area: number;
}

interface CropTask {
  id: number;
  cropId: number;
  title: string;
  date: string;
  completed: boolean;
  priority: TaskPriority;
}

const CropCard = ({ 
  crop, 
  onEdit, 
  onDelete 
}: { 
  crop: CropData; 
  onEdit: (crop: CropData) => void;
  onDelete: (id: number) => void;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'growing': return 'bg-agri-success';
      case 'harvested': return 'bg-agri-primary';
      case 'planned': return 'bg-agri-warning';
      default: return 'bg-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'growing': return 'Growing';
      case 'harvested': return 'Harvested';
      case 'planned': return 'Planted';
      default: return 'Unknown';
    }
  };

  const daysRemaining = () => {
    const today = new Date();
    const harvest = new Date(crop.harvestDate);
    const diffTime = Math.abs(harvest.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="border rounded-xl p-4 bg-white hover:shadow-md transition-shadow card-hover">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium">{crop.name}</h3>
          <p className="text-xs text-muted-foreground">{crop.variety}</p>
        </div>
        <div className={`flex items-center px-2 py-0.5 rounded-full text-xs ${getStatusColor(crop.status)} bg-opacity-10 text-foreground`}>
          <span className={`w-2 h-2 rounded-full ${getStatusColor(crop.status)} mr-1.5`}></span>
          {getStatusLabel(crop.status)}
        </div>
      </div>
      
      <div className="bg-muted rounded-lg p-3 mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Field:</span>
          <span className="font-medium">{crop.parcel}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>Surface Area:</span>
          <span className="font-medium">{crop.area} ha</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Jours avant recolte:</span>
          <span className="font-medium">{daysRemaining()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex flex-col items-center p-2 bg-agri-primary/5 rounded-md">
          <span className="text-muted-foreground">Seeding</span>
          <span className="font-medium">{new Date(crop.plantingDate).toLocaleDateString()}</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-agri-accent/5 rounded-md">
          <span className="text-muted-foreground">Harvest</span>
          <span className="font-medium">{new Date(crop.harvestDate).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="flex justify-between mt-3 pt-3 border-t border-border">
        <button 
          className="p-1.5 hover:bg-gray-100 rounded"
          onClick={() => onEdit(crop)}
        >
          <Edit className="h-4 w-4 text-muted-foreground" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </button>
        <button 
          className="p-1.5 hover:bg-gray-100 rounded text-agri-danger"
          onClick={() => onDelete(crop.id)}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const CropPlanning = () => {
  const [cropsData, setCropsData] = useState<CropData[]>(initialCropsData);
  const [cropTasks, setCropTasks] = useState<CropTask[]>(initialCropTasks);
  const [currentView, setCurrentView] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCropForm, setShowCropForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState<CropData | null>(null);
  const [newTask, setNewTask] = useState<Partial<CropTask>>({
    title: '',
    cropId: 0,
    date: new Date().toISOString().split('T')[0],
    priority: 'medium',
    completed: false
  });
  const [newCrop, setNewCrop] = useState<Partial<CropData>>({
    name: '',
    variety: '',
    parcel: '',
    plantingDate: new Date().toISOString().split('T')[0],
    harvestDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
    status: 'planned',
    area: 0
  });
  
  const filteredCrops = cropsData.filter(crop => 
    crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.parcel.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: '', date: null, events: [] });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day).toISOString().split('T')[0];
      const dayEvents = monthlyEvents.find(event => event.date === date)?.events || [];
      days.push({ day, date, events: dayEvents });
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const formatMonth = () => {
    return currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const handleEditCrop = (crop: CropData) => {
    setEditingCrop({...crop});
    setShowCropForm(true);
  };

  const handleAddCrop = () => {
    setEditingCrop(null);
    setNewCrop({
      name: '',
      variety: '',
      parcel: '',
      plantingDate: new Date().toISOString().split('T')[0],
      harvestDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
      status: 'planned',
      area: 0
    });
    setShowCropForm(true);
  };

  const handleDeleteCrop = (id: number) => {
    setCropsData(cropsData.filter(crop => crop.id !== id));
    setCropTasks(cropTasks.filter(task => task.cropId !== id));
    toast.success('Crop deletede successfully');
  };

  const handleSaveCrop = () => {
    if (editingCrop) {
      setCropsData(cropsData.map(crop => 
        crop.id === editingCrop.id ? editingCrop : crop
      ));
      toast.success('Crop mise a jour successfully');
    } else if (newCrop.name && newCrop.parcel) {
      const newId = Math.max(0, ...cropsData.map(c => c.id)) + 1;
      setCropsData([...cropsData, { 
        id: newId,
        name: newCrop.name || '',
        variety: newCrop.variety || '',
        parcel: newCrop.parcel || '',
        plantingDate: newCrop.plantingDate || new Date().toISOString().split('T')[0],
        harvestDate: newCrop.harvestDate || new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
        status: newCrop.status as CropStatus || 'planned',
        area: newCrop.area || 0
      } as CropData]);
      toast.success('New crop added');
    } else {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setShowCropForm(false);
  };

  const handleSaveTask = () => {
    if (!newTask.title || !newTask.cropId) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newId = Math.max(0, ...cropTasks.map(t => t.id)) + 1;
    const taskToAdd = {
      id: newId,
      cropId: Number(newTask.cropId),
      title: newTask.title,
      date: newTask.date || new Date().toISOString().split('T')[0],
      completed: false,
      priority: newTask.priority as TaskPriority || 'medium'
    } as CropTask;

    setCropTasks([...cropTasks, taskToAdd]);
    setShowTaskForm(false);
    toast.success('New task added');
  };

  const handleTaskUpdate = (index: number, field: string, value: any) => {
    const updatedTasks = [...cropTasks];
    (updatedTasks[index] as any)[field] = value;
    setCropTasks(updatedTasks);
  };

  const handleTaskDelete = (index: number) => {
    const updatedTasks = [...cropTasks];
    updatedTasks.splice(index, 1);
    setCropTasks(updatedTasks);
    toast.success('Task deletede');
  };

  const taskColumns: Column[] = [
    { id: 'title', header: 'Task', accessorKey: 'title', isEditable: true },
    { 
      id: 'crop', 
      header: 'Crop', 
      accessorKey: 'cropId', 
      isEditable: false,
    },
    { id: 'date', header: 'Date', accessorKey: 'date', isEditable: true },
    { 
      id: 'priority', 
      header: 'Priority', 
      accessorKey: 'priority',
      isEditable: true,
      type: 'select',
      options: ['high', 'medium', 'low']
    },
  ];

  const tasksTableData = cropTasks.map(task => {
    const relatedCrop = cropsData.find(crop => crop.id === task.cropId);
    return {
      ...task,
      cropName: relatedCrop?.name || 'Unknown'
    };
  });
  
  return (
    <div className="p-6 animate-enter">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Planification of Crops Indiannes</h1>
          <p className="text-muted-foreground">Gerez les cultures locales et planifiez vos activites agriculturals</p>
        </div>
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'list' 
                ? 'bg-agri-primary text-white' 
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
            onClick={() => setCurrentView('list')}
          >
            Liste
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'calendar' 
                ? 'bg-agri-primary text-white' 
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
            onClick={() => setCurrentView('calendar')}
          >
            Calendrier
          </button>
          <button 
            className="inline-flex items-center justify-center px-4 py-2 bg-agri-primary text-white rounded-lg hover:bg-agri-primary-dark transition-colors whitespace-nowrap ml-2"
            onClick={() => setShowTaskForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </button>
        </div>
      </header>

      {currentView === 'list' ? (
        <>
          <div className="flex gap-3 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search une culture..." 
                className="pl-10 pr-4 py-2 w-full border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="inline-flex items-center justify-center px-4 py-2 bg-agri-primary text-white rounded-lg hover:bg-agri-primary-dark transition-colors whitespace-nowrap"
              onClick={handleAddCrop}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add une culture
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map(crop => (
              <CropCard 
                key={crop.id} 
                crop={crop}
                onEdit={handleEditCrop}
                onDelete={handleDeleteCrop}
              />
            ))}
          </div>

          <div className="mt-8 border rounded-xl p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upcoming Tasks</h2>
              <button 
                className="text-sm text-agri-primary hover:unerline"
                onClick={() => setShowTaskForm(true)}
              >
                Add une tache
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left">Task</th>
                    <th className="px-4 py-2 text-left">Crop</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Priority</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cropTasks.map((task, index) => {
                    const relatedCrop = cropsData.find(crop => crop.id === task.cropId);
                    
                    return (
                      <tr key={task.id} className="border-t">
                        <td className="px-4 py-3">
                          <EditableField
                            value={task.title}
                            onSave={(value) => handleTaskUpdate(index, 'title', value)}
                          />
                        </td>
                        <td className="px-4 py-3">{relatedCrop?.name}</td>
                        <td className="px-4 py-3">
                          <EditableField
                            type="text"
                            value={task.date}
                            onSave={(value) => handleTaskUpdate(index, 'date', value)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span 
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              task.priority === 'high' 
                                ? 'bg-agri-danger/10 text-agri-danger' 
                                : task.priority === 'medium' 
                                  ? 'bg-agri-warning/10 text-agri-warning' 
                                  : 'bg-agri-success/10 text-agri-success'
                            }`}
                          >
                            <select
                              value={task.priority}
                              onChange={(e) => handleTaskUpdate(index, 'priority', e.target.value)}
                              className="bg-transparent border-none focus:outline-none p-0 m-0"
                            >
                              <option value="high">High</option>
                              <option value="medium">Average</option>
                              <option value="low">Low</option>
                            </select>
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button 
                              className="p-1 hover:bg-gray-100 rounded-full"
                              onClick={() => {
                                handleTaskUpdate(index, 'completed', !task.completed);
                                toast.success(task.completed ? 'Task marquee comme non-terminee' : 'Task terminee !');
                              }}
                            >
                              <Check className={`h-4 w-4 ${task.completed ? 'text-agri-success' : 'text-gray-400'}`} />
                            </button>
                            <button 
                              className="p-1 hover:bg-gray-100 rounded-full"
                              onClick={() => handleTaskDelete(index)}
                            >
                              <Trash2 className="h-4 w-4 text-agri-danger" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="border rounded-xl p-6 bg-white">
          <div className="flex justify-between items-center mb-6">
            <button onClick={prevMonth} className="p-2 hover:bg-muted rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold capitalize">{formatMonth()}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-full">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
              <div key={day} className="text-center font-medium text-sm py-2 text-muted-foreground">
                {day}
              </div>
            ))}
            
            {calendarDays.map((day, i) => (
              <div 
                key={i} 
                className={`min-h-[100px] p-1 border ${
                  day.day ? 'bg-white' : 'bg-muted/30'
                } rounded-md`}
              >
                {day.day && (
                  <>
                    <div className="text-right text-sm p-1">{day.day}</div>
                    <div className="space-y-1">
                      {day.events.map(event => (
                        <div 
                          key={event.id} 
                          className={`text-xs p-1 rounded truncate ${
                            event.priority === 'high' 
                              ? 'bg-agri-danger/10 text-agri-danger' 
                              : event.priority === 'medium' 
                                ? 'bg-agri-warning/10 text-agri-warning' 
                                : 'bg-agri-success/10 text-agri-success'
                          }`}
                          title={`${event.title} - ${event.crop}`}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showTaskForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add une tache</h2>
              <button 
                onClick={() => setShowTaskForm(false)}
                className="p-1 hover:bg-muted rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-input rounded-md"
                  placeholder="Name of la tache"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Crop</label>
                <select 
                  className="w-full px-3 py-2 border border-input rounded-md"
                  value={newTask.cropId || ''}
                  onChange={(e) => setNewTask({...newTask, cropId: Number(e.target.value)})}
                >
                  <option value="">Select a culture</option>
                  {cropsData.map(crop => (
                    <option key={crop.id} value={crop.id}>
                      {crop.name} - {crop.parcel}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-input rounded-md"
                  value={newTask.date}
                  onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select 
                  className="w-full px-3 py-2 border border-input rounded-md"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'high' | 'medium' | 'low'})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Average</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea 
                  className="w-full px-3 py-2 border border-input rounded-md"
                  rows={3}
                  placeholder="Details supplementaires..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="px-4 py-2 text-sm text-foreground bg-muted rounded-md hover:bg-muted/80"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSaveTask}
                  className="px-4 py-2 text-sm text-white bg-agri-primary rounded-md hover:bg-agri-primary-dark"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCropForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingCrop ? 'Edit une culture' : 'Add une culture'}
              </h2>
              <button 
                onClick={() => setShowCropForm(false)}
                className="p-1 hover:bg-muted rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name*</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-input rounded-md"
                  placeholder="Name of la culture"
                  value={editingCrop ? editingCrop.name : newCrop.name}
                  onChange={(e) => {
                    if (editingCrop) {
                      setEditingCrop({...editingCrop, name: e.target.value});
                    } else {
                      setNewCrop({...newCrop, name: e.target.value});
                    }
                  }}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Variety</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-input rounded-md"
                  placeholder="Variety"
                  value={editingCrop ? editingCrop.variety : newCrop.variety}
                  onChange={(e) => {
                    if (editingCrop) {
                      setEditingCrop({...editingCrop, variety: e.target.value});
                    } else {
                      setNewCrop({...newCrop, variety: e.target.value});
                    }
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Field*</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-input rounded-md"
                  placeholder="Field name"
                  value={editingCrop ? editingCrop.parcel : newCrop.parcel}
                  onChange={(e) => {
                    if (editingCrop) {
                      setEditingCrop({...editingCrop, parcel: e.target.value});
                    } else {
                      setNewCrop({...newCrop, parcel: e.target.value});
                    }
                  }}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date of field</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-input rounded-md"
                    value={editingCrop ? editingCrop.plantingDate : newCrop.plantingDate}
                    onChange={(e) => {
                      if (editingCrop) {
                        setEditingCrop({...editingCrop, plantingDate: e.target.value});
                      } else {
                        setNewCrop({...newCrop, plantingDate: e.target.value});
                      }
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Harvest Date</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-input rounded-md"
                    value={editingCrop ? editingCrop.harvestDate : newCrop.harvestDate}
                    onChange={(e) => {
                      if (editingCrop) {
                        setEditingCrop({...editingCrop, harvestDate: e.target.value});
                      } else {
                        setNewCrop({...newCrop, harvestDate: e.target.value});
                      }
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Surface Area (ha)</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-input rounded-md"
                  placeholder="Surface en hectares"
                  value={editingCrop ? editingCrop.area : newCrop.area}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (editingCrop) {
                      setEditingCrop({...editingCrop, area: isNaN(value) ? 0 : value});
                    } else {
                      setNewCrop({...newCrop, area: isNaN(value) ? 0 : value});
                    }
                  }}
                  step="0.1"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select 
                  className="w-full px-3 py-2 border border-input rounded-md"
                  value={editingCrop ? editingCrop.status : newCrop.status}
                  onChange={(e) => {
                    const status = e.target.value as 'growing' | 'harvested' | 'planned';
                    if (editingCrop) {
                      setEditingCrop({...editingCrop, status});
                    } else {
                      setNewCrop({...newCrop, status});
                    }
                  }}
                >
                  <option value="planned">Planted</option>
                  <option value="growing">Growing</option>
                  <option value="harvested">Harvested</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowCropForm(false)}
                  className="px-4 py-2 text-sm text-foreground bg-muted rounded-md hover:bg-muted/80"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSaveCrop}
                  className="px-4 py-2 text-sm text-white bg-agri-primary rounded-md hover:bg-agri-primary-dark"
                >
                  {editingCrop ? 'Edit' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropPlanning;

