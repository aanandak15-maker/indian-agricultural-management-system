import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Calendar, 
  Filter,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertCircle,
  CloudRain,
  Sun,
  Wind,
  Droplet,
  ArrowRight,
  Save
} from 'lucide-react';
import { EditableField } from './ui/editable-field';
import { toast } from 'sonner';

// Types for fields adapted to Indian agriculture
interface FieldData {
  id: number;
  name: string;
  area: number;
  crop: string;
  status: 'active' | 'inactive' | 'planned';
  lastActivity: string;
  soilType: string;
  coordinates: { lat: number; lng: number };
  irrigation: string;
  plantingDate?: string;
  harvestDate?: string;
  owner?: string;
  rainfall?: number;
  notes?: string;
}

// Field data adapted to Indian agriculture
const initialFieldData: FieldData[] = [
  { 
    id: 1, 
    name: 'North Field A1', 
    area: 12.5, 
    crop: 'Rice', 
    status: 'active', 
    lastActivity: '2023-08-15', 
    soilType: 'Alluvial', 
    coordinates: { lat: 30.7333, lng: 76.7794 },
    irrigation: 'Canal',
    plantingDate: '2023-06-15',
    harvestDate: '2023-10-20',
    owner: 'Rajesh Kumar',
    rainfall: 850,
    notes: 'High-yield variety planted. Monitor for pest activity.'
  },
  { 
    id: 2, 
    name: 'South Field B2', 
    area: 8.3, 
    crop: 'Wheat', 
    status: 'planned', 
    lastActivity: '2023-08-10', 
    soilType: 'Black Cotton', 
    coordinates: { lat: 19.0760, lng: 72.8777 },
    irrigation: 'Drip',
    plantingDate: '2023-11-10',
    harvestDate: '2024-04-15',
    owner: 'Priya Sharma',
    rainfall: 650,
    notes: 'Prepare for winter crop planting.'
  },
  { 
    id: 3, 
    name: 'East Field C3', 
    area: 15.2, 
    crop: 'Cotton', 
    status: 'active', 
    lastActivity: '2023-08-12', 
    soilType: 'Red Soil', 
    coordinates: { lat: 17.3850, lng: 78.4867 },
    irrigation: 'Sprinkler',
    plantingDate: '2023-05-20',
    harvestDate: '2023-12-15',
    owner: 'Suresh Patel',
    rainfall: 750,
    notes: 'Bt cotton variety. Regular monitoring required.'
  },
  { 
    id: 4, 
    name: 'West Field D4', 
    area: 6.8, 
    crop: 'Sugarcane', 
    status: 'active', 
    lastActivity: '2023-08-14', 
    soilType: 'Alluvial', 
    coordinates: { lat: 26.9124, lng: 75.7873 },
    irrigation: 'Flood',
    plantingDate: '2023-02-10',
    harvestDate: '2024-01-20',
    owner: 'Amit Singh',
    rainfall: 900,
    notes: 'Good growth rate. Harvest expected in January.'
  }
];

const IndianFieldManagement = () => {
  const [fields, setFields] = useState<FieldData[]>(initialFieldData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'planned'>('all');
  const [selectedField, setSelectedField] = useState<FieldData | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter fields based on search and status
  const filteredFields = fields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.owner?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || field.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleFieldUpdate = (fieldId: number, key: keyof FieldData, value: string | number) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, [key]: value } : field
    ));
    toast.success('Field updated successfully');
  };

  const handleDeleteField = (fieldId: number) => {
    setFields(fields.filter(field => field.id !== fieldId));
    toast.success('Field deleted successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'planned': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCropIcon = (crop: string) => {
    switch (crop.toLowerCase()) {
      case 'rice': return '🌾';
      case 'wheat': return '🌾';
      case 'cotton': return '🌿';
      case 'sugarcane': return '🎋';
      case 'maize': return '🌽';
      default: return '🌱';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Indian Field Management</h2>
          <p className="text-muted-foreground">
            Manage your agricultural fields across different regions of India
          </p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-agri-primary text-white rounded-lg hover:bg-agri-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Field
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search fields by name, crop, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-primary"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-primary"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="planned">Planned</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFields.map((field) => (
          <div key={field.id} className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
            {/* Field Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getCropIcon(field.crop)}</div>
                <div>
                  <h3 className="font-semibold text-lg">
                    <EditableField
                      value={field.name}
                      onSave={(value) => handleFieldUpdate(field.id, 'name', String(value))}
                      className="inline-block"
                    />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <EditableField
                      value={field.owner || 'Unassigned'}
                      onSave={(value) => handleFieldUpdate(field.id, 'owner', String(value))}
                      className="inline-block"
                    />
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={() => setSelectedField(field)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </button>
                <button 
                  onClick={() => handleDeleteField(field.id)}
                  className="p-1 hover:bg-red-50 rounded text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Field Stats */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Area:</span>
                <span className="font-medium">
                  <EditableField
                    value={field.area}
                    type="number"
                    onSave={(value) => handleFieldUpdate(field.id, 'area', Number(value))}
                    className="inline-block"
                  /> ha
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Crop:</span>
                <span className="font-medium">
                  <EditableField
                    value={field.crop}
                    onSave={(value) => handleFieldUpdate(field.id, 'crop', String(value))}
                    className="inline-block"
                  />
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Soil Type:</span>
                <span className="font-medium">
                  <EditableField
                    value={field.soilType}
                    onSave={(value) => handleFieldUpdate(field.id, 'soilType', String(value))}
                    className="inline-block"
                  />
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Irrigation:</span>
                <span className="font-medium">
                  <EditableField
                    value={field.irrigation}
                    onSave={(value) => handleFieldUpdate(field.id, 'irrigation', String(value))}
                    className="inline-block"
                  />
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(field.status)}`}>
                  {field.status.charAt(0).toUpperCase() + field.status.slice(1)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Activity:</span>
                <span className="text-sm">
                  <EditableField
                    value={field.lastActivity}
                    type="date"
                    onSave={(value) => handleFieldUpdate(field.id, 'lastActivity', String(value))}
                    className="inline-block"
                  />
                </span>
              </div>
            </div>

            {/* Weather Info */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <CloudRain className="h-4 w-4 text-blue-500" />
                  <span>Rainfall: {field.rainfall}mm</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Sun className="h-4 w-4 text-yellow-500" />
                  <Wind className="h-4 w-4 text-gray-500" />
                  <Droplet className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-agri-primary/10 text-agri-primary rounded-lg hover:bg-agri-primary/20 transition-colors">
              View Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-semibold mb-4">Field Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-agri-primary">{fields.length}</p>
            <p className="text-sm text-muted-foreground">Total Fields</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {fields.reduce((sum, field) => sum + field.area, 0).toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground">Total Area (ha)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {fields.filter(f => f.status === 'active').length}
            </p>
            <p className="text-sm text-muted-foreground">Active Fields</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {new Set(fields.map(f => f.crop)).size}
            </p>
            <p className="text-sm text-muted-foreground">Crop Types</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndianFieldManagement;