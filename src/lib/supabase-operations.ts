import { supabase } from './supabase'
import { Database } from './supabase'

type Field = Database['public']['Tables']['fields']['Row']
type FieldInsert = Database['public']['Tables']['fields']['Insert']
type FieldUpdate = Database['public']['Tables']['fields']['Update']

type CropHistory = Database['public']['Tables']['crop_history']['Row']
type CropHistoryInsert = Database['public']['Tables']['crop_history']['Insert']
type CropHistoryUpdate = Database['public']['Tables']['crop_history']['Update']

type FinancialRecord = Database['public']['Tables']['financial_records']['Row']
type FinancialRecordInsert = Database['public']['Tables']['financial_records']['Insert']
type FinancialRecordUpdate = Database['public']['Tables']['financial_records']['Update']

type Inventory = Database['public']['Tables']['inventory']['Row']
type InventoryInsert = Database['public']['Tables']['inventory']['Insert']
type InventoryUpdate = Database['public']['Tables']['inventory']['Update']

// Field Operations
export const fieldOperations = {
  // Get all fields for a user
  async getFields(userId: string): Promise<Field[]> {
    const { data, error } = await supabase
      .from('fields')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get a single field by ID
  async getField(fieldId: string): Promise<Field | null> {
    const { data, error } = await supabase
      .from('fields')
      .select('*')
      .eq('id', fieldId)
      .single()

    if (error) throw error
    return data
  },

  // Create a new field
  async createField(field: FieldInsert): Promise<Field> {
    const { data, error } = await supabase
      .from('fields')
      .insert([field])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update a field
  async updateField(fieldId: string, updates: FieldUpdate): Promise<Field> {
    const { data, error } = await supabase
      .from('fields')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', fieldId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete a field
  async deleteField(fieldId: string): Promise<void> {
    const { error } = await supabase
      .from('fields')
      .delete()
      .eq('id', fieldId)

    if (error) throw error
  }
}

// Crop History Operations
export const cropHistoryOperations = {
  // Get crop history for a field
  async getCropHistory(fieldId: string): Promise<CropHistory[]> {
    const { data, error } = await supabase
      .from('crop_history')
      .select('*')
      .eq('field_id', fieldId)
      .order('year', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create crop history entry
  async createCropHistory(entry: CropHistoryInsert): Promise<CropHistory> {
    const { data, error } = await supabase
      .from('crop_history')
      .insert([entry])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update crop history entry
  async updateCropHistory(entryId: string, updates: CropHistoryUpdate): Promise<CropHistory> {
    const { data, error } = await supabase
      .from('crop_history')
      .update(updates)
      .eq('id', entryId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete crop history entry
  async deleteCropHistory(entryId: string): Promise<void> {
    const { error } = await supabase
      .from('crop_history')
      .delete()
      .eq('id', entryId)

    if (error) throw error
  }
}

// Financial Records Operations
export const financialOperations = {
  // Get financial records for a user
  async getFinancialRecords(userId: string, fieldId?: string): Promise<FinancialRecord[]> {
    let query = supabase
      .from('financial_records')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (fieldId) {
      query = query.eq('field_id', fieldId)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  },

  // Create financial record
  async createFinancialRecord(record: FinancialRecordInsert): Promise<FinancialRecord> {
    const { data, error } = await supabase
      .from('financial_records')
      .insert([record])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update financial record
  async updateFinancialRecord(recordId: string, updates: FinancialRecordUpdate): Promise<FinancialRecord> {
    const { data, error } = await supabase
      .from('financial_records')
      .update(updates)
      .eq('id', recordId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete financial record
  async deleteFinancialRecord(recordId: string): Promise<void> {
    const { error } = await supabase
      .from('financial_records')
      .delete()
      .eq('id', recordId)

    if (error) throw error
  },

  // Get financial summary
  async getFinancialSummary(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('financial_records')
      .select('type, amount, date')
      .eq('user_id', userId)

    if (startDate) {
      query = query.gte('date', startDate)
    }
    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data, error } = await query

    if (error) throw error

    const summary = data?.reduce((acc, record) => {
      if (record.type === 'revenue') {
        acc.totalRevenue += record.amount
      } else {
        acc.totalExpenses += record.amount
      }
      return acc
    }, { totalRevenue: 0, totalExpenses: 0 }) || { totalRevenue: 0, totalExpenses: 0 }

    return {
      ...summary,
      netProfit: summary.totalRevenue - summary.totalExpenses
    }
  }
}

// Inventory Operations
export const inventoryOperations = {
  // Get inventory for a user
  async getInventory(userId: string): Promise<Inventory[]> {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create inventory item
  async createInventoryItem(item: InventoryInsert): Promise<Inventory> {
    const { data, error } = await supabase
      .from('inventory')
      .insert([item])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update inventory item
  async updateInventoryItem(itemId: string, updates: InventoryUpdate): Promise<Inventory> {
    const { data, error } = await supabase
      .from('inventory')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', itemId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete inventory item
  async deleteInventoryItem(itemId: string): Promise<void> {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', itemId)

    if (error) throw error
  }
}

// Statistics Operations
export const statisticsOperations = {
  // Get yield statistics
  async getYieldStatistics(userId: string) {
    const { data, error } = await supabase
      .from('fields')
      .select(`
        crop,
        area,
        crop_history (
          year,
          yield
        )
      `)
      .eq('user_id', userId)

    if (error) throw error

    // Process the data to calculate yield statistics
    const yieldData = data?.map(field => ({
      name: field.crop || 'Unknown',
      current: field.crop_history?.[0]?.yield || 0,
      previous: field.crop_history?.[1]?.yield || 0,
      unit: 't/ha'
    })) || []

    return yieldData
  },

  // Get profitability by field
  async getProfitabilityByField(userId: string) {
    const { data, error } = await supabase
      .from('fields')
      .select(`
        id,
        name,
        area,
        crop,
        financial_records (
          type,
          amount
        )
      `)
      .eq('user_id', userId)

    if (error) throw error

    const profitabilityData = data?.map(field => {
      const revenue = field.financial_records
        ?.filter(record => record.type === 'revenue')
        .reduce((sum, record) => sum + record.amount, 0) || 0

      const expenses = field.financial_records
        ?.filter(record => record.type === 'expense')
        .reduce((sum, record) => sum + record.amount, 0) || 0

      return {
        name: field.name,
        profitability: revenue - expenses,
        size: field.area,
        crop: field.crop || 'Unknown'
      }
    }) || []

    return profitabilityData
  }
}
