
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Dashboard from '../components/Dashboard';
import TabContainer, { TabItem } from '../components/layout/TabContainer';
import IndianHarvestTracking from '../components/IndianHarvestTracking';
import IndianWeatherAlerts from '../components/IndianWeatherAlerts';
import TaskList from '../components/cultures/TaskList';
import { Button } from '@/components/ui/button';
import { PlusCircle, Download, Filter, RefreshCw, Upload, Printer } from 'lucide-react';
import { StatisticsProvider } from '../contexts/StatisticsContext';
import { useSupabaseCRM } from '../contexts/SupabaseCRMContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userName, setUserName] = useState('Farmer');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Use Supabase CRM context
  const { 
    lastSync,
    isRefreshing,
    syncDataAcrossCRM
  } = useSupabaseCRM();

  // Actions based on the active tab
  const getTabActions = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={syncDataAcrossCRM}
            >
              <RefreshCw className={`h-4 w-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              Sync
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={() => handleExportData('dashboard')}
            >
              <Download className="h-4 w-4 text-gray-600" />
              Export
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={() => handleImportData()}
            >
              <Upload className="h-4 w-4 text-gray-600" />
              Import
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={() => handlePrintData('dashboard')}
            >
              <Printer className="h-4 w-4 text-gray-600" />
              Print
            </Button>
          </div>
        );
      case 'harvest':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => handleExportData('harvest')}
            >
              <Download className="h-4 w-4 text-gray-600" />
              Export
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => handlePrintData('harvest')}
            >
              <Printer className="h-4 w-4 text-gray-600" />
              Print
            </Button>
          </div>
        );
      case 'weather':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => handleExportData('weather')}
            >
              <Download className="h-4 w-4 text-gray-600" />
              Export
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 text-gray-600" />
              Configure
            </Button>
          </div>
        );
      case 'tasks':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <PlusCircle className="h-4 w-4" />
              Add
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => handleExportData('tasks')}
            >
              <Download className="h-4 w-4 text-gray-600" />
              Export
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => handlePrintData('tasks')}
            >
              <Printer className="h-4 w-4 text-gray-600" />
              Print
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    console.log(`Tab changed to: ${value}`);
  };

  // Data manipulations
  const handleExportData = async (tab: string) => {
    console.log(`Export functionality for ${tab} - Coming soon with Supabase integration`);
    // TODO: Implement export functionality with Supabase data
  };

  const handleImportData = () => {
    setImportDialogOpen(true);
  };

  const handleImportConfirm = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
    
    console.log(`Import functionality - Coming soon with Supabase integration`);
    // TODO: Implement import functionality with Supabase data
    
    setImportDialogOpen(false);
    setSelectedFile(null);
  };

  const handlePrintData = async (tab: string) => {
    console.log(`Print functionality for ${tab} - Coming soon with Supabase integration`);
    // TODO: Implement print functionality with Supabase data
  };

  const tabs: TabItem[] = [
    {
      value: 'dashboard',
      label: 'Dashboard',
      content: <Dashboard />
    },
    {
      value: 'harvest',
      label: 'Harvest Tracking',
      content: <IndianHarvestTracking />
    },
    {
      value: 'weather',
      label: 'Weather Alerts',
      content: <IndianWeatherAlerts />
    },
    {
      value: 'tasks',
      label: 'Tasks',
      content: <TaskList />
    }
  ];

  return (
    <StatisticsProvider>
      <PageLayout>
        <div className="p-6 animate-enter">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Agricultural Dashboard</h1>
              <p className="text-gray-500">
                Welcome, {userName} | Last synchronization: {lastSync.toLocaleTimeString()}
              </p>
            </div>
            {getTabActions()}
          </div>
          
          <TabContainer 
            tabs={tabs}
            defaultValue={activeTab}
            onValueChange={handleTabChange}
          />
          
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Import Data</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file">CSV File</Label>
                  <input 
                    type="file" 
                    id="file" 
                    accept=".csv" 
                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Data will be imported into the current module. 
                  Make sure the file is in CSV format.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleImportConfirm}>Import</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PageLayout>
    </StatisticsProvider>
  );
};

export default Index;
