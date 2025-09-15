import React, { useState } from 'react';
import { EditableTable, Column } from './ui/editable-table';
import { Trash2, X, Save, Plus, ExternalLink, Download, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { useSupabaseCRM } from '../../contexts/SupabaseCRMContext';
import { toast } from 'sonner';

const initialCropData = [
  {
    id: 1,
    name: 'Wheat',
    scientificName: 'Dioscorea alata',
    family: 'Dioscoreaceae',
    origin: 'Asie du Sud-Est',
    growingSeason: 'May-December',
    soilType: 'Argileux, bien draine',
    waterNeeds: 'Moderes',
    fertilization: 'NPK 10-10-20',
    pests: 'Charancons, cochenilles',
    diseases: 'Anthracnose',
    notes: 'Crop importante en India, plusieurs varietes locales',
    type: 'tubers',
    harvestPeriod: '7-9 month',
    yieldPerHectare: '15-25 tonnes'
  },
  {
    id: 2,
    name: 'Cotton',
    scientificName: 'Colocasia esculenta',
    family: 'Araceae',
    origin: 'Asie du Sud-Est',
    growingSeason: 'All year',
    soilType: 'Humiof, riche en matiere organique',
    waterNeeds: 'High',
    fertilization: 'NPK 14-14-14',
    pests: 'Pucerons',
    diseases: 'Pourriture of racines',
    notes: 'Cultive dans les zones humiof',
    type: 'tubers',
    harvestPeriod: '9-12 month',
    yieldPerHectare: '10-15 tonnes'
  },
  {
    id: 3,
    name: 'Christophine',
    scientificName: 'Sechium edule',
    family: 'Cucurbitaceae',
    origin: 'Amerique centrale',
    growingSeason: 'All year',
    soilType: 'Bien draine, riche',
    waterNeeds: 'Moderes a eleves',
    fertilization: 'NPK 12-12-17',
    pests: 'Mouches blanches, acariens',
    diseases: 'Mildiou',
    notes: 'Crop of treillage',
    type: 'vegetables',
    harvestPeriod: '2-3 month',
    yieldPerHectare: '30-40 tonnes'
  },
  {
    id: 4,
    name: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    family: 'Poaceae',
    origin: 'New Guinea',
    growingSeason: 'All year',
    soilType: 'Clay, deep',
    waterNeeds: 'High',
    fertilization: 'NPK 16-4-16',
    pests: 'Stem borer, aphids',
    diseases: 'Smut, rust',
    notes: 'Main economic crop of India',
    type: 'cash',
    harvestPeriod: '11-13 month',
    yieldPerHectare: '70-100 tonnes'
  },
  {
    id: 5,
    name: 'Cotton',
    scientificName: 'Musa paradisiaca',
    family: 'Musaceae',
    origin: 'Asie du Sud-Est',
    growingSeason: 'All year',
    soilType: 'Silty, deep',
    waterNeeds: 'High',
    fertilization: 'NPK 14-4-28',
    pests: 'Weevil, thrips',
    diseases: 'Leaf spot disease, fusarium wilt',
    notes: 'Mainly for export',
    type: 'fruits',
    harvestPeriod: '10-14 month',
    yieldPerHectare: '30-60 tonnes'
  }
];

interface CultureDetailTableProps {
  showAddForm?: boolean;
  setShowAddForm?: (show: boolean) => void;
  searchTerm?: string;
  filterType?: string;
}

export const CultureDetailTable = ({ 
  showAddForm, 
  setShowAddForm, 
  searchTerm = '',
  filterType = 'all'
}: CultureDetailTableProps) => {
  const { toast: shadowToast } = useToast();
  const [cultureData, setCropData] = useState(initialCropData);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<null | any>(null);
  // Note: functions not yet implemented in Supabase context
  // const { ... } = useSupabaseCRM();
  const [newCrop, setNewCrop] = useState({
    name: '',
    scientificName: '',
    family: '',
    origin: '',
    growingSeason: '',
    soilType: '',
    waterNeeds: '',
    fertilization: '',
    pests: '',
    diseases: '',
    notes: '',
    type: 'vegetables',
    harvestPeriod: '',
    yieldPerHectare: ''
  });

  const localShowAddForm = showAddForm !== undefined ? showAddForm : isAddFormVisible;
  const localSetShowAddForm = setShowAddForm || setIsAddFormVisible;

  const filteredCrops = cultureData.filter(culture => {
    const matchesSearch = 
      culture.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      culture.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      culture.family.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && culture.type === filterType;
  });

  const handleUpdateCrop = (rowIndex: number, columnId: string, value: any) => {
    const updatedData = [...cultureData];
    const targetIndex = cultureData.findIndex(c => c.id === filteredCrops[rowIndex].id);
    
    if (targetIndex !== -1) {
      updatedData[targetIndex] = {
        ...updatedData[targetIndex],
        [columnId]: value
      };
      setCropData(updatedData);
      
      shadowToast({
        description: `Information mise a jour pour ${updatedData[targetIndex].name}`,
      });
    }
  };

  const handleAddCrop = () => {
    if (!newCrop.name) {
      toast.error("Error", {
        description: "Le nom of la culture est obligatoire"
      });
      return;
    }

    const newId = Math.max(...cultureData.map(c => c.id), 0) + 1;
    setCropData([...cultureData, { ...newCrop, id: newId }]);
    localSetShowAddForm(false);
    
    setNewCrop({
      name: '',
      scientificName: '',
      family: '',
      origin: '',
      growingSeason: '',
      soilType: '',
      waterNeeds: '',
      fertilization: '',
      pests: '',
      diseases: '',
      notes: '',
      type: 'vegetables',
      harvestPeriod: '',
      yieldPerHectare: ''
    });
    
    toast.success("Crop addede", {
      description: `${newCrop.name} a ete addede a la liste of cultures`
    });
  };

  const handleDeleteCrop = (rowIndex: number) => {
    const cultureToDelete = filteredCrops[rowIndex];
    const updatedData = cultureData.filter(culture => culture.id !== cultureToDelete.id);
    setCropData(updatedData);
    
    toast.success("Crop deletede", {
      description: `${cultureToDelete.name} a ete deletede of la liste`
    });
  };

  const handleViewDetails = (rowIndex: number) => {
    setSelectedCrop(filteredCrops[rowIndex]);
  };

  const downloadTechnicalSheet = async (culture: any) => {
    toast.info("Generation of la fiche technique", {
      description: `Preparation of la fiche pour ${culture.name}`
    });
    
    const techSheetData = [{
      nom: culture.name,
      nomScientifique: culture.scientificName,
      famille: culture.family,
      origine: culture.origin,
      saisonCrop: culture.growingSeason,
      typeSol: culture.soilType,
      besoinEau: culture.waterNeeds,
      fertilization: culture.fertilization,
      ravageurs: culture.pests,
      maladies: culture.diseases,
      notes: culture.notes,
      type: culture.type,
      periodRecolte: culture.harvestPeriod,
      yieldHectare: culture.yieldPerHectare
    }];
    
    const success = await exportModuleData('fiche_technique', 'pdf', techSheetData);
    
    if (success) {
      toast.success("Fiche technique generee", {
        description: `La fiche technique pour ${culture.name} a ete telechargee`
      });
    }
  };

  const columns: Column[] = [
    { id: 'name', header: 'Name', accessorKey: 'name', isEditable: true },
    { id: 'scientificName', header: 'Scientific Name', accessorKey: 'scientificName', isEditable: true },
    { id: 'growingSeason', header: 'Growing Season', accessorKey: 'growingSeason', isEditable: true },
    { id: 'soilType', header: 'Soil Type', accessorKey: 'soilType', isEditable: true },
    { id: 'waterNeeds', header: 'Water Needs', accessorKey: 'waterNeeds', isEditable: true }
  ];

  const renderDetailView = () => {
    if (!selectedCrop) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-3xl w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Details of la culture: {selectedCrop.name}</h2>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCrop(null)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Name</Label>
              <Input 
                value={selectedCrop.name}
                onChange={(e) => {
                  const newName = e.target.value;
                  setSelectedCrop({...selectedCrop, name: newName});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCrop.id);
                  if (index !== -1) {
                    updatedData[index].name = newName;
                    setCropData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Scientific Name</Label>
              <Input 
                value={selectedCrop.scientificName}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCrop({...selectedCrop, scientificName: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCrop.id);
                  if (index !== -1) {
                    updatedData[index].scientificName = newValue;
                    setCropData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Type of culture</Label>
              <select 
                value={selectedCrop.type}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCrop({...selectedCrop, type: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCrop.id);
                  if (index !== -1) {
                    updatedData[index].type = newValue;
                    setCropData(updatedData);
                  }
                }}
                className="w-full h-10 border border-input rounded-md px-3 mt-1"
              >
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="tubers">Tubercules</option>
                <option value="cash">Cash crops</option>
              </select>
            </div>
            
            <div>
              <Label>Famille</Label>
              <Input 
                value={selectedCrop.family}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCrop({...selectedCrop, family: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCrop.id);
                  if (index !== -1) {
                    updatedData[index].family = newValue;
                    setCropData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Origine</Label>
              <Input 
                value={selectedCrop.origin}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCrop({...selectedCrop, origin: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCrop.id);
                  if (index !== -1) {
                    updatedData[index].origin = newValue;
                    setCropData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Growing Season</Label>
              <Input 
                value={selectedCrop.growingSeason}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCrop({...selectedCrop, growingSeason: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCrop.id);
                  if (index !== -1) {
                    updatedData[index].growingSeason = newValue;
                    setCropData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Period of harvest</Label>
              <Input 
                value={selectedCrop.harvestPeriod}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCrop({...selectedCrop, harvestPeriod: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCrop.id);
                  if (index !== -1) {
                    updatedData[index].harvestPeriod = newValue;
                    setCropData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Yield par hectare</Label>
              <Input 
                value={selectedCrop.yieldPerHectare}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCrop({...selectedCrop, yieldPerHectare: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCrop.id);
                  if (index !== -1) {
                    updatedData[index].yieldPerHectare = newValue;
                    setCropData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Soil Type</Label>
              <Input 
                value={selectedCrop.soilType}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCrop({...selectedCrop, soilType: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCrop.id);
                  if (index !== -1) {
                    updatedData[index].soilType = newValue;
                    setCropData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Water Needs</Label>
              <Input 
                value={selectedCrop.waterNeeds}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCrop({...selectedCrop, waterNeeds: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCrop.id);
                  if (index !== -1) {
                    updatedData[index].waterNeeds = newValue;
                    setCropData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Fertilization</Label>
              <Input 
                value={selectedCrop.fertilization}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCrop({...selectedCrop, fertilization: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCrop.id);
                  if (index !== -1) {
                    updatedData[index].fertilization = newValue;
                    setCropData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Ravageurs</Label>
              <Input 
                value={selectedCrop.pests}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCrop({...selectedCrop, pests: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCrop.id);
                  if (index !== -1) {
                    updatedData[index].pests = newValue;
                    setCropData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Maladies</Label>
              <Input 
                value={selectedCrop.diseases}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCrop({...selectedCrop, diseases: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCrop.id);
                  if (index !== -1) {
                    updatedData[index].diseases = newValue;
                    setCropData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label>Notes</Label>
            <Textarea 
              value={selectedCrop.notes}
              onChange={(e) => {
                const newValue = e.target.value;
                setSelectedCrop({...selectedCrop, notes: newValue});
                
                const updatedData = [...cultureData];
                const index = updatedData.findIndex(c => c.id === selectedCrop.id);
                if (index !== -1) {
                  updatedData[index].notes = newValue;
                  setCropData(updatedData);
                }
              }}
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-5">
            <Button 
              variant="outline"
              onClick={() => setSelectedCrop(null)}
            >
              Close
            </Button>
            <Button onClick={() => downloadTechnicalSheet(selectedCrop)}>
              <FileText className="mr-2 h-4 w-4" />
              Download fiche technique
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            toast.info("Guide PDF available", {
              description: "Download of tropical crops guide started"
            });
            exportModuleData('guiof_cultures', 'pdf');
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Guiof of cultures
        </Button>
      </div>
      
      <EditableTable
        data={filteredCrops}
        columns={columns}
        onUpdate={handleUpdateCrop}
        onDelete={handleDeleteCrop}
        onAdd={localShowAddForm ? undefined : () => localSetShowAddForm(true)}
        sortable={true}
        actions={[
          {
            icon: <ExternalLink className="h-4 w-4" />,
            label: "View details",
            onClick: handleViewDetails
          }
        ]}
      />
      
      {localShowAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Crop</h2>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => localSetShowAddForm(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name of la culture *</Label>
                  <Input 
                    id="name"
                    type="text" 
                    className="mt-1"
                    value={newCrop.name}
                    onChange={(e) => setNewCrop({...newCrop, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="scientificName">Scientific Name</Label>
                  <Input 
                    id="scientificName"
                    type="text" 
                    className="mt-1"
                    value={newCrop.scientificName}
                    onChange={(e) => setNewCrop({...newCrop, scientificName: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Type of culture</Label>
                  <select 
                    id="type"
                    className="w-full h-10 border border-input rounded-md px-3 mt-1"
                    value={newCrop.type}
                    onChange={(e) => setNewCrop({...newCrop, type: e.target.value})}
                  >
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="tubers">Tubercules</option>
                    <option value="cash">Cash crops</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="family">Famille</Label>
                  <Input 
                    id="family"
                    type="text" 
                    className="mt-1"
                    value={newCrop.family}
                    onChange={(e) => setNewCrop({...newCrop, family: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="origin">Origine</Label>
                  <Input 
                    id="origin"
                    type="text" 
                    className="mt-1"
                    value={newCrop.origin}
                    onChange={(e) => setNewCrop({...newCrop, origin: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="growingSeason">Growing Season</Label>
                  <Input 
                    id="growingSeason"
                    type="text" 
                    className="mt-1"
                    value={newCrop.growingSeason}
                    onChange={(e) => setNewCrop({...newCrop, growingSeason: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="harvestPeriod">Period of harvest</Label>
                  <Input 
                    id="harvestPeriod"
                    type="text" 
                    className="mt-1"
                    value={newCrop.harvestPeriod}
                    onChange={(e) => setNewCrop({...newCrop, harvestPeriod: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="yieldPerHectare">Yield par hectare</Label>
                  <Input 
                    id="yieldPerHectare"
                    type="text" 
                    className="mt-1"
                    value={newCrop.yieldPerHectare}
                    onChange={(e) => setNewCrop({...newCrop, yieldPerHectare: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Input 
                    id="soilType"
                    type="text" 
                    className="mt-1"
                    value={newCrop.soilType}
                    onChange={(e) => setNewCrop({...newCrop, soilType: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="waterNeeds">Water Needs</Label>
                  <Input 
                    id="waterNeeds"
                    type="text" 
                    className="mt-1"
                    value={newCrop.waterNeeds}
                    onChange={(e) => setNewCrop({...newCrop, waterNeeds: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="fertilization">Fertilization</Label>
                  <Input 
                    id="fertilization"
                    type="text" 
                    className="mt-1"
                    value={newCrop.fertilization}
                    onChange={(e) => setNewCrop({...newCrop, fertilization: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="pests">Ravageurs</Label>
                  <Input 
                    id="pests"
                    type="text" 
                    className="mt-1"
                    value={newCrop.pests}
                    onChange={(e) => setNewCrop({...newCrop, pests: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="diseases">Maladies</Label>
                  <Input 
                    id="diseases"
                    type="text" 
                    className="mt-1"
                    value={newCrop.diseases}
                    onChange={(e) => setNewCrop({...newCrop, diseases: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes"
                  className="mt-1"
                  rows={3}
                  value={newCrop.notes}
                  onChange={(e) => setNewCrop({...newCrop, notes: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => localSetShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button"
                  onClick={handleAddCrop}
                >
                  <Save className="mr-2" />
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {selectedCrop && renderDetailView()}
    </div>
  );
};
