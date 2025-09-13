import React, { useState } from 'react';
import { EditableField } from './ui/editable-field';
import { EditableTable, Column } from './ui/editable-table';
import { 
  Map, 
  MapPin, 
  Tractor, 
  Calendar, 
  PlaneTakeoff, 
  CloudRain, 
  Thermometer, 
  LineChart,
  Camera,
  Plus,
  Trash2,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { useParams } from 'react-router-dom';
import { Button } from './ui/button';

interface FieldDetail {
  id: string;
  name: string;
  location: string;
  surface: number;
  soilType: string;
  crops: { crop: string; variety: string; plantingDate: string; harvestDate: string; status: string }[];
  irrigationSystem: string;
  notes: string;
  owner: string;
  lastInspection: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  images: string[];
}

interface TaskData {
  id: number;
  task: string;
  dueDate: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'To Do' | 'In Progress' | 'Completed';
}

const fieldData: FieldDetail = {
  id: 'FIELD-001',
  name: 'North Field A1',
  location: 'Punjab, India',
  surface: 12.5,
  soilType: 'Alluvial',
  crops: [
    { crop: 'Rice', variety: 'Basmati 1121', plantingDate: '2023-06-15', harvestDate: '2023-10-20', status: 'Growing' },
    { crop: 'Wheat', variety: 'HD 2967', plantingDate: '2023-11-10', harvestDate: '2024-04-15', status: 'Planned' }
  ],
  irrigationSystem: 'Drip Irrigation',
  notes: 'High-yield field with excellent drainage. Monitor for pest activity during monsoon.',
  owner: 'Rajesh Kumar',
  lastInspection: '2023-08-15',
  coordinates: {
    latitude: 30.7333,
    longitude: 76.7794
  },
  images: []
};

const initialTasks: TaskData[] = [
  { id: 1, task: 'Apply fertilizer to rice crop', dueDate: '2023-08-25', assignedTo: 'Farm Worker 1', priority: 'High', status: 'To Do' },
  { id: 2, task: 'Check irrigation system', dueDate: '2023-08-22', assignedTo: 'Technician', priority: 'Medium', status: 'In Progress' },
  { id: 3, task: 'Pest control spray', dueDate: '2023-08-28', assignedTo: 'Farm Worker 2', priority: 'High', status: 'To Do' },
  { id: 4, task: 'Soil pH testing', dueDate: '2023-08-30', assignedTo: 'Agronomist', priority: 'Low', status: 'To Do' }
];

const IndianFieldDetail = () => {
  const { id } = useParams();
  const [field, setField] = useState<FieldDetail>(fieldData);
  const [tasks, setTasks] = useState<TaskData[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const handleFieldUpdate = (key: keyof FieldDetail, value: string | number) => {
    setField(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success('Field information updated successfully');
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: TaskData = {
        id: Math.max(...tasks.map(t => t.id)) + 1,
        task: newTaskTitle,
        dueDate: new Date().toISOString().split('T')[0],
        assignedTo: 'Unassigned',
        priority: 'Medium',
        status: 'To Do'
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setShowAddTask(false);
      toast.success('New task added successfully');
    }
  };

const taskColumns: Column[] = [
  { id: 'task', header: 'Task', accessorKey: 'task', isEditable: true },
  { id: 'dueDate', header: 'Due Date', accessorKey: 'dueDate', type: 'date', isEditable: true },
  { id: 'assignedTo', header: 'Assigned To', accessorKey: 'assignedTo', isEditable: true },
  { id: 'priority', header: 'Priority', accessorKey: 'priority', isEditable: true },
  { id: 'status', header: 'Status', accessorKey: 'status', isEditable: true }
];

const handleTaskUpdate = (rowIndex: number, columnId: string, value: string | number) => {
  const newTasks = [...tasks];
  const updatedTask = { ...newTasks[rowIndex] };

  if (columnId === 'dueDate') {
    updatedTask.dueDate = String(value);
  } else if (columnId === 'task') {
    updatedTask.task = String(value);
  } else if (columnId === 'assignedTo') {
    updatedTask.assignedTo = String(value);
  } else if (columnId === 'priority') {
    updatedTask.priority = value as TaskData['priority'];
  } else if (columnId === 'status') {
    updatedTask.status = value as TaskData['status'];
  }

  newTasks[rowIndex] = updatedTask;
  setTasks(newTasks);
  toast.success('Task updated successfully');
};

const handleTaskDelete = (rowIndex: number) => {
  const deletedTask = tasks[rowIndex];
  const newTasks = [...tasks];
  newTasks.splice(rowIndex, 1);
  setTasks(newTasks);
  toast.success('Task deleted successfully');
};

  return (
    <div className="space-y-6">
      {/* Field Header */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-agri-primary/10 rounded-lg">
              <MapPin className="h-6 w-6 text-agri-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                <EditableField
                  value={field.name}
                  onSave={(value) => handleFieldUpdate('name', String(value))}
                  className="inline-block"
                />
              </h1>
              <p className="text-muted-foreground">
                <EditableField
                  value={field.location}
                  onSave={(value) => handleFieldUpdate('location', String(value))}
                  className="inline-block"
                />
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Add Photo
            </Button>
            <Button variant="outline" size="sm">
              <Map className="h-4 w-4 mr-2" />
              View on Map
            </Button>
          </div>
        </div>

        {/* Field Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Surface Area</p>
            <p className="text-xl font-semibold">
              <EditableField
                value={field.surface}
                type="number"
                onSave={(value) => handleFieldUpdate('surface', Number(value))}
                className="inline-block"
              /> hectares
            </p>
          </div>
          <div className="p-4 bg-muted/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Soil Type</p>
            <p className="text-lg font-medium">
              <EditableField
                value={field.soilType}
                onSave={(value) => handleFieldUpdate('soilType', String(value))}
                className="inline-block"
              />
            </p>
          </div>
          <div className="p-4 bg-muted/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Irrigation</p>
            <p className="text-lg font-medium">
              <EditableField
                value={field.irrigationSystem}
                onSave={(value) => handleFieldUpdate('irrigationSystem', String(value))}
                className="inline-block"
              />
            </p>
          </div>
          <div className="p-4 bg-muted/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Last Inspection</p>
            <p className="text-lg font-medium">
              <EditableField
                value={field.lastInspection}
                type="date"
                onSave={(value) => handleFieldUpdate('lastInspection', String(value))}
                className="inline-block"
              />
            </p>
          </div>
        </div>
      </div>

      {/* Current Crops */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <PlaneTakeoff className="h-5 w-5 mr-2 text-agri-primary" />
          Current Crops
        </h2>
        <div className="space-y-3">
          {field.crops.map((crop, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Crop</p>
                  <p className="font-medium">{crop.crop}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Variety</p>
                  <p className="font-medium">{crop.variety}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Planting Date</p>
                  <p className="font-medium">{crop.plantingDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expected Harvest</p>
                  <p className="font-medium">{crop.harvestDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    crop.status === 'Growing' 
                      ? 'bg-green-100 text-green-800' 
                      : crop.status === 'Planned'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {crop.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Field Tasks */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-agri-primary" />
            Field Tasks
          </h2>
          <Button 
            onClick={() => setShowAddTask(true)}
            className="bg-agri-primary hover:bg-agri-primary-dark"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {showAddTask && (
          <div className="mb-4 p-4 border rounded-lg bg-muted/20">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter task description"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddTask} size="sm">
                <Check className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddTask(false)} 
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <EditableTable
          data={tasks}
          columns={taskColumns}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
        />
      </div>

      {/* Field Notes */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-4">Field Notes</h2>
<EditableField
  value={field.notes}
  onSave={(value) => handleFieldUpdate('notes', String(value))}
  className="w-full min-h-[100px] p-3 border rounded-lg"
/>
      </div>
    </div>
  );
};

export default IndianFieldDetail;
