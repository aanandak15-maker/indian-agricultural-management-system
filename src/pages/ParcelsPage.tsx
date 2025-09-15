
import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, subDays } from 'date-fns';
import PageLayout from '../components/layout/PageLayout';
import ParcelManagement from '../components/ParcelManagement';
import PageHeader from '../components/layout/PageHeader';
import usePageMetadata from '../hooks/use-page-metadata';
import ParcelFilters from '../components/parcels/ParcelFilters';
import ParcelActionButtons from '../components/parcels/ParcelActionButtons';
import ParcelMapDialog from '../components/parcels/ParcelMapDialog';
import ParcelImportDialog from '../components/parcels/ParcelImportDialog';
import IndianFieldManagement from '../components/IndianFieldManagement';
import { useSupabaseCRM } from '../contexts/SupabaseCRMContext';
import { FileSpreadsheet, FileBarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ParcelsPage = () => {
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Field Management',
    defaultDescription: 'Manage, organize and optimize all your agricultural fields'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [mapPreviewOpen, setMapPreviewOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [layersDialogOpen, setLayersDialogOpen] = useState(false);
  const [weatherAlertsOpen, setWeatherAlertsOpen] = useState(false);
  const [showIndianView, setShowIndianView] = useState(true);
  const [lastSyncDate, setLastSyncDate] = useState<Date>(new Date());
  const { syncDataAcrossCRM } = useSupabaseCRM();
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 50]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const [activeParcelAlerts, setActiveParcelAlerts] = useState([
    { id: 1, parcel: 'Field A12', type: 'Heavy rainfall', severity: 'High' },
    { id: 2, parcel: 'Field B05', type: 'Drought', severity: 'Medium' }
  ]);

  // Simulate data synchronization with other modules
  useEffect(() => {
    const syncWithOtherModules = () => {
      console.log("Data synchronization with crops and statistics modules");
      
      // Simulate synchronization delay
      const timer = setTimeout(() => {
        setLastSyncDate(new Date());
        syncDataAcrossCRM();
        console.log("Field data is now synchronized with all modules");
      }, 1500);
      
      return () => clearTimeout(timer);
    };
    
    syncWithOtherModules();
  }, [syncDataAcrossCRM]);

  const handleExportData = () => {
    console.log("Export of all field data has started");
    console.log("Exported data is now available in the Statistics module");
  };

  const handleImportData = () => {
    setImportDialogOpen(true);
  };
  
  const handleImportConfirm = (importType: string) => {
    setImportDialogOpen(false);
    console.log(`${importType} data has been imported successfully`);
    console.log("Crops and Statistics modules have been updated with new data");
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      console.log(`Search performed for "${searchTerm}"`);
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Extreme':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleView = () => {
    setShowIndianView(!showIndianView);
    console.log(`${showIndianView ? 'Standard' : 'Indian'} view activated`);
    console.log(`Data displayed in Crops and Finance modules has been adapted`);
  };

  const handleGenerateStatistics = () => {
    setStatsDialogOpen(true);
    console.log("Your field statistics have been generated");
  };

  const handleOpenLayerManager = () => {
    setLayersDialogOpen(true);
    console.log("Layer manager opened");
  };

  const handleAddParcel = () => {
    console.log("Field creation form opened");
  };

  return (
    <PageLayout>
      <div className="p-6 animate-enter">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <PageHeader 
              title={title}
              description={description}
              onTitleChange={handleTitleChange}
              onDescriptionChange={handleDescriptionChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Last synchronization with other modules: {lastSyncDate.toLocaleString()}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <ParcelFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterType={filterType}
              setFilterType={setFilterType}
              onSearch={handleSearch}
              dateRange={dateRange}
              setDateRange={setDateRange}
              areaRange={areaRange}
              setAreaRange={setAreaRange}
            />
            
            <ParcelActionButtons 
              onExportData={handleExportData}
              onImportData={handleImportData}
              onOpenMap={() => setMapPreviewOpen(true)}
              onAddParcel={handleAddParcel}
              onGenerateStatistics={handleGenerateStatistics}
              onOpenLayerManager={handleOpenLayerManager}
              activeParcelAlerts={activeParcelAlerts}
              weatherAlertsOpen={weatherAlertsOpen}
              setWeatherAlertsOpen={setWeatherAlertsOpen}
              getSeverityColor={getSeverityColor}
            />
            
            <button 
              className="inline-flex items-center px-4 py-2 border border-input bg-white rounded-lg hover:bg-muted/30 transition-colors"
              onClick={toggleView}
            >
              {showIndianView ? 'Standard View' : 'Indian View'}
            </button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 p-4 bg-white rounded-xl border border-muted"
        >
          <div className="flex items-center mb-2">
            <FileSpreadsheet className="h-5 w-5 mr-2 text-agri-primary" />
            <h2 className="text-lg font-medium">Field Statistics Overview</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
              <p className="text-sm text-muted-foreground">Total Area</p>
              <p className="text-2xl font-semibold">128.5 ha</p>
            </div>
            <div className="p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
              <p className="text-sm text-muted-foreground">Active Fields</p>
              <p className="text-2xl font-semibold">42</p>
            </div>
            <div className="p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
              <p className="text-sm text-muted-foreground">Average Yield</p>
              <p className="text-2xl font-semibold">7.2 t/ha</p>
            </div>
            <div className="p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
              <p className="text-sm text-muted-foreground">Main Crops</p>
              <p className="text-xl font-semibold">Rice, Wheat, Cotton</p>
            </div>
          </div>
        </motion.div>

        {showIndianView ? (
          <IndianFieldManagement />
        ) : (
          <ParcelManagement />
        )}
        
        <ParcelMapDialog 
          isOpen={mapPreviewOpen} 
          onOpenChange={setMapPreviewOpen} 
        />
        
        <ParcelImportDialog 
          isOpen={importDialogOpen} 
          onOpenChange={setImportDialogOpen}
          onImportConfirm={handleImportConfirm}
        />
      </div>
    </PageLayout>
  );
};

export default ParcelsPage;
