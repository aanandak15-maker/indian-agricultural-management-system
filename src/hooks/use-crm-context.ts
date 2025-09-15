import { useState, useEffect, useCallback } from 'react';
import { exportToCSV, exportToExcel, exportToPDF, importFromCSV, printData } from '../utils/crm-data-operations';

// Types for global CRM context
interface CRMContextState {
  lastSync: Date;
  isRefreshing: boolean;
  companyName: string;
  activeModules: string[];
  syncDataAcrossCRM: () => void;
  updateModuleData: (moduleName: string, data: any) => void;
  getModuleData: (moduleName: string) => any;
  exportModuleData: (moduleName: string, format: 'csv' | 'excel' | 'pdf', customData?: any[]) => Promise<boolean>;
  importModuleData: (moduleName: string, file: File) => Promise<boolean>;
  printModuleData: (moduleName: string, options?: any) => Promise<boolean>;
}

// Custom hook to manage global CRM context
export const useCRMContext = (): CRMContextState => {
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [moduleData, setModuleData] = useState<Record<string, any>>({
    fields: {
      items: [
        { id: 1, name: "North Field", area: 12.5, crop: "Sugarcane", status: "Growing" },
        { id: 2, name: "South Field", area: 8.3, crop: "Cotton", status: "Harvesting" },
        { id: 3, name: "East Field", area: 5.2, crop: "Rice", status: "In preparation" }
      ],
      columns: [
        { key: "id", header: "ID" },
        { key: "name", header: "Name" },
        { key: "area", header: "Area (ha)" },
        { key: "crop", header: "Crop" },
        { key: "status", header: "Status" }
      ]
    },
    crops: {
      items: [
        { id: 1, name: "Sugarcane", variety: "R579", startDate: "2023-03-15", endDate: "2024-03-15" },
        { id: 2, name: "Cotton", variety: "Dwarf Granof", startDate: "2023-02-10", endDate: "2023-12-10" },
        { id: 3, name: "Rice", variety: "MD-2", startDate: "2023-05-05", endDate: "2024-06-01" }
      ],
      columns: [
        { key: "id", header: "ID" },
        { key: "name", header: "Crop" },
        { key: "variety", header: "Variety" },
        { key: "startDate", header: "Start Date" },
        { key: "endDate", header: "End Date" }
      ]
    },
    finance: {
      items: [
        { id: 1, type: "revenue", amount: 15000, description: "Sugarcane harvest sale", date: "2023-06-15" },
        { id: 2, type: "expense", amount: 5000, description: "Purchase fertilizers", date: "2023-05-10" },
        { id: 3, type: "revenue", amount: 8500, description: "Banana sale", date: "2023-07-20" }
      ],
      columns: [
        { key: "id", header: "ID" },
        { key: "date", header: "Date" },
        { key: "type", header: "Type" },
        { key: "description", header: "Description" },
        { key: "amount", header: "Amount (₹)" }
      ]
    },
    statistics: {
      items: [
        { period: "2023-T1", cultureId: 1, yield: 8.2, revenue: 12500, costs: 4200 },
        { period: "2023-T2", cultureId: 1, yield: 8.5, revenue: 13000, costs: 4100 },
        { period: "2023-T1", cultureId: 2, yield: 15.3, revenue: 7800, costs: 2100 }
      ],
      columns: [
        { key: "period", header: "Period" },
        { key: "cultureId", header: "Crop ID" },
        { key: "yield", header: "Yield (t/ha)" },
        { key: "revenue", header: "Revenue (₹)" },
        { key: "costs", header: "Costs (₹)" }
      ]
    },
    inventory: {
      items: [
        { id: 1, name: "NPK Fertilizer", category: "Inputs", quantity: 500, unit: "kg", price: 2.5 },
        { id: 2, name: "Bio Pesticide", category: "Inputs", quantity: 50, unit: "L", price: 18.75 },
        { id: 3, name: "Tractor", category: "Equipment", quantity: 2, unit: "units", price: 25000 }
      ],
      columns: [
        { key: "id", header: "ID" },
        { key: "name", header: "Name" },
        { key: "category", header: "Category" },
        { key: "quantity", header: "Quantity" },
        { key: "unit", header: "Unit" },
        { key: "price", header: "Unit Price (₹)" }
      ]
    }
  });
  const [activeModules, setActiveModules] = useState<string[]>([
    'fields',
    'crops',
    'finance',
    'statistics',
    'inventory'
  ]);
  
  // Company name
  const companyName = 'Agri Dom';

  // Data synchronization across all CRM modules
  const syncDataAcrossCRM = useCallback(() => {
    setIsRefreshing(true);
    
    // Simulate synchronization time
    setTimeout(() => {
      setLastSync(new Date());
      setIsRefreshing(false);
    }, 1500);
  }, []);

  // Update data for a specific module
  const updateModuleData = useCallback((moduleName: string, data: any) => {
    setModuleData(prevData => ({
      ...prevData,
      [moduleName]: {
        ...prevData[moduleName],
        ...data
      }
    }));
    
    // Update last synchronization date
    setLastSync(new Date());
  }, []);

  // Get data from a specific module
  const getModuleData = useCallback((moduleName: string) => {
    return moduleData[moduleName] || {};
  }, [moduleData]);

  // Export module data to specified format
  const exportModuleData = useCallback(async (
    moduleName: string, 
    format: 'csv' | 'excel' | 'pdf',
    customData?: any[]
  ): Promise<boolean> => {
    // Use custom data if provided, otherwise get from module
    const data = customData || getModuleData(moduleName)?.items;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return false;
    }
    
    try {
      let success = false;
      
      // Handle special cases like technical sheets and guiof
      if (moduleName === 'technical_sheet') {
        return await exportToPDF(data, `${companyName}_technical_sheet`, {
          title: `${companyName} - Technical Sheet`,
          landscape: false,
          template: 'technical_sheet'
        });
      } else if (moduleName === 'crops_guide') {
        return true;
      }
      
      // Standard formats
      switch (format) {
        case 'csv':
          success = exportToCSV(data, `${companyName}_${moduleName}`);
          break;
        case 'excel':
          success = exportToExcel(data, `${companyName}_${moduleName}`);
          break;
        case 'pdf':
          success = await exportToPDF(data, `${companyName}_${moduleName}`);
          break;
        default:
          return false;
      }
      
      return success;
    } catch (error) {
      console.error(`Error exporting ${moduleName} data:`, error);
      return false;
    }
  }, [getModuleData, companyName]);

  // Import module data
  const importModuleData = useCallback(async (moduleName: string, file: File): Promise<boolean> => {
    try {
      const importedData = await importFromCSV(file);
      
      if (importedData && importedData.length > 0) {
        updateModuleData(moduleName, {
          items: importedData
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error importing ${moduleName} data:`, error);
      return false;
    }
  }, [updateModuleData]);

  // Print module data
  const printModuleData = useCallback(async (moduleName: string, options?: any): Promise<boolean> => {
    const data = getModuleData(moduleName);
    
    if (!data || !data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return false;
    }
    
    const moduleNames: Record<string, string> = {
      fields: "Fields",
      crops: "Crops",
      finance: "Finance",
      statistics: "Statistics",
      inventory: "Inventory",
      technical_sheet: "Technical Sheet"
    };
    
    const title = `${companyName} - ${moduleNames[moduleName] || moduleName}`;
    
    try {
      return await printData(
        data.items,
        title,
        data.columns || Object.keys(data.items[0]).map(key => ({ key, header: key })),
        options
      );
    } catch (error) {
      console.error(`Error printing ${moduleName} data:`, error);
      return false;
    }
  }, [getModuleData, companyName]);

  // Synchronisation initiale au chargement
  useEffect(() => {
    const initialSync = setTimeout(() => {
      syncDataAcrossCRM();
    }, 1000);
    
    return () => clearTimeout(initialSync);
  }, [syncDataAcrossCRM]);

  return {
    lastSync,
    isRefreshing,
    companyName,
    activeModules,
    syncDataAcrossCRM,
    updateModuleData,
    getModuleData,
    exportModuleData,
    importModuleData,
    printModuleData
  };
};

export default useCRMContext;
