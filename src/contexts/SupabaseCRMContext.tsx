import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  fieldOperations, 
  cropHistoryOperations, 
  financialOperations, 
  inventoryOperations,
  statisticsOperations 
} from '../lib/supabase-operations';
import { toast } from 'sonner';

// Types for the enhanced CRM context
interface SupabaseCRMContextType {
  // Fields
  fields: any[];
  loadingFields: boolean;
  createField: (fieldData: any) => Promise<boolean>;
  updateField: (fieldId: string, updates: any) => Promise<boolean>;
  deleteField: (fieldId: string) => Promise<boolean>;
  refreshFields: () => Promise<void>;

  // Crop History
  getCropHistory: (fieldId: string) => Promise<any[]>;
  createCropHistory: (entry: any) => Promise<boolean>;
  updateCropHistory: (entryId: string, updates: any) => Promise<boolean>;
  deleteCropHistory: (entryId: string) => Promise<boolean>;

  // Financial Records
  financialRecords: any[];
  loadingFinancial: boolean;
  createFinancialRecord: (record: any) => Promise<boolean>;
  updateFinancialRecord: (recordId: string, updates: any) => Promise<boolean>;
  deleteFinancialRecord: (recordId: string) => Promise<boolean>;
  getFinancialSummary: (startDate?: string, endDate?: string) => Promise<any>;
  refreshFinancial: () => Promise<void>;

  // Inventory
  inventory: any[];
  loadingInventory: boolean;
  createInventoryItem: (item: any) => Promise<boolean>;
  updateInventoryItem: (itemId: string, updates: any) => Promise<boolean>;
  deleteInventoryItem: (itemId: string) => Promise<boolean>;
  refreshInventory: () => Promise<void>;

  // Statistics
  getYieldStatistics: () => Promise<any[]>;
  getProfitabilityByField: () => Promise<any[]>;

  // Sync status
  lastSync: Date;
  isRefreshing: boolean;
  syncDataAcrossCRM: () => Promise<void>;
}

const SupabaseCRMContext = createContext<SupabaseCRMContextType | undefined>(undefined);

export const useSupabaseCRM = () => {
  const context = useContext(SupabaseCRMContext);
  if (context === undefined) {
    throw new Error('useSupabaseCRM must be used within a SupabaseCRMProvider');
  }
  return context;
};

interface SupabaseCRMProviderProps {
  children: ReactNode;
}

export const SupabaseCRMProvider: React.FC<SupabaseCRMProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [fields, setFields] = useState<any[]>([]);
  const [financialRecords, setFinancialRecords] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loadingFields, setLoadingFields] = useState(false);
  const [loadingFinancial, setLoadingFinancial] = useState(false);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load initial data when user changes
  useEffect(() => {
    if (user) {
      loadAllData();
    } else {
      // Clear data when user logs out
      setFields([]);
      setFinancialRecords([]);
      setInventory([]);
    }
  }, [user]);

  const loadAllData = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    try {
      await Promise.all([
        refreshFields(),
        refreshFinancial(),
        refreshInventory()
      ]);
      setLastSync(new Date());
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading data');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Field operations
  const refreshFields = async () => {
    if (!user) return;
    
    setLoadingFields(true);
    try {
      const data = await fieldOperations.getFields(user.id);
      setFields(data);
    } catch (error) {
      console.error('Error loading fields:', error);
      toast.error('Error loading fields');
    } finally {
      setLoadingFields(false);
    }
  };

  const createField = async (fieldData: any): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const newField = await fieldOperations.createField({
        ...fieldData,
        user_id: user.id
      });
      setFields(prev => [newField, ...prev]);
      toast.success('Field created successfully');
      return true;
    } catch (error) {
      console.error('Error creating field:', error);
      toast.error('Error creating field');
      return false;
    }
  };

  const updateField = async (fieldId: string, updates: any): Promise<boolean> => {
    try {
      const updatedField = await fieldOperations.updateField(fieldId, updates);
      setFields(prev => prev.map(field => 
        field.id === fieldId ? updatedField : field
      ));
      toast.success('Field updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating field:', error);
      toast.error('Error updating field');
      return false;
    }
  };

  const deleteField = async (fieldId: string): Promise<boolean> => {
    try {
      await fieldOperations.deleteField(fieldId);
      setFields(prev => prev.filter(field => field.id !== fieldId));
      toast.success('Field deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting field:', error);
      toast.error('Error deleting field');
      return false;
    }
  };

  // Crop history operations
  const getCropHistory = async (fieldId: string): Promise<any[]> => {
    try {
      return await cropHistoryOperations.getCropHistory(fieldId);
    } catch (error) {
      console.error('Error loading crop history:', error);
      toast.error('Error loading crop history');
      return [];
    }
  };

  const createCropHistory = async (entry: any): Promise<boolean> => {
    try {
      await cropHistoryOperations.createCropHistory(entry);
      toast.success('Crop history entry created successfully');
      return true;
    } catch (error) {
      console.error('Error creating crop history:', error);
      toast.error('Error creating crop history entry');
      return false;
    }
  };

  const updateCropHistory = async (entryId: string, updates: any): Promise<boolean> => {
    try {
      await cropHistoryOperations.updateCropHistory(entryId, updates);
      toast.success('Crop history entry updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating crop history:', error);
      toast.error('Error updating crop history entry');
      return false;
    }
  };

  const deleteCropHistory = async (entryId: string): Promise<boolean> => {
    try {
      await cropHistoryOperations.deleteCropHistory(entryId);
      toast.success('Crop history entry deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting crop history:', error);
      toast.error('Error deleting crop history entry');
      return false;
    }
  };

  // Financial operations
  const refreshFinancial = async () => {
    if (!user) return;
    
    setLoadingFinancial(true);
    try {
      const data = await financialOperations.getFinancialRecords(user.id);
      setFinancialRecords(data);
    } catch (error) {
      console.error('Error loading financial records:', error);
      toast.error('Error loading financial records');
    } finally {
      setLoadingFinancial(false);
    }
  };

  const createFinancialRecord = async (record: any): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const newRecord = await financialOperations.createFinancialRecord({
        ...record,
        user_id: user.id
      });
      setFinancialRecords(prev => [newRecord, ...prev]);
      toast.success('Financial record created successfully');
      return true;
    } catch (error) {
      console.error('Error creating financial record:', error);
      toast.error('Error creating financial record');
      return false;
    }
  };

  const updateFinancialRecord = async (recordId: string, updates: any): Promise<boolean> => {
    try {
      const updatedRecord = await financialOperations.updateFinancialRecord(recordId, updates);
      setFinancialRecords(prev => prev.map(record => 
        record.id === recordId ? updatedRecord : record
      ));
      toast.success('Financial record updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating financial record:', error);
      toast.error('Error updating financial record');
      return false;
    }
  };

  const deleteFinancialRecord = async (recordId: string): Promise<boolean> => {
    try {
      await financialOperations.deleteFinancialRecord(recordId);
      setFinancialRecords(prev => prev.filter(record => record.id !== recordId));
      toast.success('Financial record deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting financial record:', error);
      toast.error('Error deleting financial record');
      return false;
    }
  };

  const getFinancialSummary = async (startDate?: string, endDate?: string) => {
    if (!user) return { totalRevenue: 0, totalExpenses: 0, netProfit: 0 };
    
    try {
      return await financialOperations.getFinancialSummary(user.id, startDate, endDate);
    } catch (error) {
      console.error('Error getting financial summary:', error);
      toast.error('Error getting financial summary');
      return { totalRevenue: 0, totalExpenses: 0, netProfit: 0 };
    }
  };

  // Inventory operations
  const refreshInventory = async () => {
    if (!user) return;
    
    setLoadingInventory(true);
    try {
      const data = await inventoryOperations.getInventory(user.id);
      setInventory(data);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast.error('Error loading inventory');
    } finally {
      setLoadingInventory(false);
    }
  };

  const createInventoryItem = async (item: any): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const newItem = await inventoryOperations.createInventoryItem({
        ...item,
        user_id: user.id
      });
      setInventory(prev => [newItem, ...prev]);
      toast.success('Inventory item created successfully');
      return true;
    } catch (error) {
      console.error('Error creating inventory item:', error);
      toast.error('Error creating inventory item');
      return false;
    }
  };

  const updateInventoryItem = async (itemId: string, updates: any): Promise<boolean> => {
    try {
      const updatedItem = await inventoryOperations.updateInventoryItem(itemId, updates);
      setInventory(prev => prev.map(item => 
        item.id === itemId ? updatedItem : item
      ));
      toast.success('Inventory item updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating inventory item:', error);
      toast.error('Error updating inventory item');
      return false;
    }
  };

  const deleteInventoryItem = async (itemId: string): Promise<boolean> => {
    try {
      await inventoryOperations.deleteInventoryItem(itemId);
      setInventory(prev => prev.filter(item => item.id !== itemId));
      toast.success('Inventory item deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast.error('Error deleting inventory item');
      return false;
    }
  };

  // Statistics operations
  const getYieldStatistics = async () => {
    if (!user) return [];
    
    try {
      return await statisticsOperations.getYieldStatistics(user.id);
    } catch (error) {
      console.error('Error getting yield statistics:', error);
      toast.error('Error getting yield statistics');
      return [];
    }
  };

  const getProfitabilityByField = async () => {
    if (!user) return [];
    
    try {
      return await statisticsOperations.getProfitabilityByField(user.id);
    } catch (error) {
      console.error('Error getting profitability data:', error);
      toast.error('Error getting profitability data');
      return [];
    }
  };

  // Sync all data
  const syncDataAcrossCRM = async () => {
    await loadAllData();
  };

  const value: SupabaseCRMContextType = {
    // Fields
    fields,
    loadingFields,
    createField,
    updateField,
    deleteField,
    refreshFields,

    // Crop History
    getCropHistory,
    createCropHistory,
    updateCropHistory,
    deleteCropHistory,

    // Financial Records
    financialRecords,
    loadingFinancial,
    createFinancialRecord,
    updateFinancialRecord,
    deleteFinancialRecord,
    getFinancialSummary,
    refreshFinancial,

    // Inventory
    inventory,
    loadingInventory,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    refreshInventory,

    // Statistics
    getYieldStatistics,
    getProfitabilityByField,

    // Sync status
    lastSync,
    isRefreshing,
    syncDataAcrossCRM
  };

  return (
    <SupabaseCRMContext.Provider value={value}>
      {children}
    </SupabaseCRMContext.Provider>
  );
};

export default SupabaseCRMProvider;
