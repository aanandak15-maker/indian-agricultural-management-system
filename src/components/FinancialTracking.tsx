
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EditableField } from './ui/editable-field';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Label } from './ui/label';
import { Input } from './ui/input';
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { CalendarIcon, PlusCircle, Download, Printer, Trash2, FileText } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PageHeader from './layout/PageHeader';

// Define monthly data
const monthlyData = [
  { name: 'Jan', income: 8500, expenses: 7200 },
  { name: 'Feb', income: 9200, expenses: 7800 },
  { name: 'Mar', income: 8800, expenses: 7400 },
  { name: 'Apr', income: 10500, expenses: 8100 },
  { name: 'May', income: 11200, expenses: 9500 },
  { name: 'June', income: 9800, expenses: 7900 },
  { name: 'Jul', income: 12500, expenses: 10200 },
];

// Schema for transaction form
const transactionSchema = z.object({
  date: z.string().min(1, "Date is required"),
  description: z.string().min(3, "Description too short"),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) !== 0, {
    message: "Invalid amount"
  }),
  category: z.string().min(1, "Category is required"),
  type: z.enum(["income", "expense"]),
});

const FinancialTracking = () => {
  // State for editable content
  const [title, setTitle] = useState('Financial Tracking');
  const [description, setDescription] = useState('Manage your income and expenses to optimize your farm profitability');
  
  // State for transactions
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2023-07-05', description: 'Harvest sale', amount: 3200, category: 'Sales', type: 'income' },
    { id: 2, date: '2023-07-10', description: 'Fertilizer purchase', amount: 850, category: 'Supplies', type: 'expense' },
    { id: 3, date: '2023-07-12', description: 'Electricity bill', amount: 320, category: 'Utilities', type: 'expense' },
    { id: 4, date: '2023-07-15', description: 'Cotton sale', amount: 1500, category: 'Sales', type: 'income' },
    { id: 5, date: '2023-07-20', description: 'Tractor repair', amount: 750, category: 'Mayntenance', type: 'expense' },
    { id: 6, date: '2023-07-25', description: 'Agricultural subsidy', amount: 4200, category: 'Subsidies', type: 'income' },
    { id: 7, date: '2023-07-28', description: 'Employee salaries', amount: 2800, category: 'Salaries', type: 'expense' },
  ]);
  
  // Filter and stats
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrer, setSortOrer] = useState('ofc');
  
  // Dialog state
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Form handling with react-hook-form
  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: "",
      category: "",
      type: "income" as "income" | "expense",
    },
  });
  
  // Categories for filtering
  const categories = ['all', ...new Set(transactions.map(t => t.category))];
  
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;
  
  // Filter transactions based on selected filters
  const filteredTransactions = transactions
    .filter(t => {
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      return matchesCategory && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrer === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'amount') {
        return sortOrer === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });
  
  // Handle form submission
  const onSubmit = (data: z.infer<typeof transactionSchema>) => {
    const newTransaction = {
      id: Math.max(...transactions.map(t => t.id), 0) + 1,
      date: data.date,
      description: data.description,
      amount: parseFloat(data.amount),
      category: data.category,
      type: data.type
    };
    
    setTransactions([newTransaction, ...transactions]);
    setShowAddDialog(false);
    form.reset();
    
    toast.success('Transaction adofd successfully');
  };
  
  // Handle oflete transaction
  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast.success('Transaction ofleted');
  };
  
  // Handle edit transaction
  const handleUpdateTransaction = (id: number, field: string, value: any) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, [field]: field === 'amount' ? parseFloat(value) : value } : t
    ));
    toast.success('Transaction updated');
  };
  
  // Export to CSV
  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Type'];
    const rows = transactions.map(t => [
      t.date, 
      t.description, 
      t.amount.toString(), 
      t.category, 
      t.type === 'income' ? 'Revenue' : 'Expense'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Data exported to CSV');
  };
  
  // Print transactions
  const printTransactions = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Unable to open print window');
      return;
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Financial Transactions</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
            .income { color: green; }
            .expense { color: red; }
            h2 { margin-bottom: 5px; }
            .summary { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Financial Transactions</h1>
          <div class="summary">
            <p>Total Revenue: <b>${totalIncome.toFixed(2)} ₹</b></p>
            <p>Total Expenses: <b>${totalExpenses.toFixed(2)} ₹</b></p>
            <p>Balance: <b class="${balance >= 0 ? 'income' : 'expense'}">${balance.toFixed(2)} ₹</b></p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(t => `
                <tr>
                  <td>${new Date(t.date).toLocaleDateString()}</td>
                  <td>${t.description}</td>
                  <td class="${t.type === 'income' ? 'income' : 'expense'}">${t.amount.toFixed(2)} ₹</td>
                  <td>${t.category}</td>
                  <td>${t.type === 'income' ? 'Revenue' : 'Expense'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    toast.success('Print prepared');
  };
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title={title}
        description={description}
        onTitleChange={(value) => {
          setTitle(String(value));
          toast.success('Title updated');
        }}
        onDescriptionChange={(value) => {
          setDescription(String(value));
          toast.success('Description updated');
        }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Revenue</CardTitle>
            <CardDescription>Total income</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{totalIncome.toFixed(2)} ₹</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Expenses</CardTitle>
            <CardDescription>Total expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{totalExpenses.toFixed(2)} ₹</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Balance</CardTitle>
            <CardDescription>Revenue - Expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {balance.toFixed(2)} ₹
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} ₹`, '']} 
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar name="Revenue" dataKey="income" fill="#4aof80" radius={[4, 4, 0, 0]} />
                  <Bar name="Expenses" dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportToCSV}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={printTransactions}
              >
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button 
                onClick={() => setShowAddDialog(true)}
                size="sm"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <select
                className="px-3 py-1 border rounded-md text-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All types</option>
                <option value="income">Revenue</option>
                <option value="expense">Expenses</option>
              </select>
              
              <select
                className="px-3 py-1 border rounded-md text-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All categories' : cat}
                  </option>
                ))}
              </select>
              
              <select
                className="px-3 py-1 border rounded-md text-sm ml-auto"
                value={`${sortBy}-${sortOrer}`}
                onChange={(e) => {
                  const [field, orer] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrer(orer as 'asc' | 'ofc');
                }}
              >
                <option value="date-ofc">Date (recent)</option>
                <option value="date-asc">Date (oloft)</option>
                <option value="amount-ofc">Amount (high)</option>
                <option value="amount-asc">Amount (low)</option>
              </select>
            </div>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(transaction => (
                  <div key={transaction.id} className="border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      <FileText className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <EditableField
                          value={new Date(transaction.date).toLocaleDateString()}
                          type="date"
                          onSave={(value) => handleUpdateTransaction(
                            transaction.id, 
                            'date', 
                            typeof value === 'string' ? value : new Date(value).toISOString().split('T')[0]
                          )}
                          className="text-sm font-medium"
                        />
                        <span className="hidden sm:inline text-muted-foreground">•</span>
                        <EditableField
                          value={transaction.category}
                          onSave={(value) => handleUpdateTransaction(transaction.id, 'category', value)}
                          className="text-xs bg-muted px-2 py-1 rounded"
                        />
                      </div>
                      <EditableField
                        value={transaction.description}
                        onSave={(value) => handleUpdateTransaction(transaction.id, 'description', value)}
                        className="text-muted-foreground text-sm mt-1"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <EditableField
                        value={transaction.amount}
                        type="number"
                        onSave={(value) => handleUpdateTransaction(transaction.id, 'amount', value)}
                        className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No transactions found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add Transaction Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Type of transaction</FormLabel>
                      <div className="flex mt-1">
                        <Button
                          type="button"
                          variant={field.value === 'income' ? 'default' : 'outline'}
                          className={field.value === 'income' ? 'bg-green-600 hover:bg-green-700' : ''}
                          onClick={() => field.onChange('income')}
                        >
                          Revenue
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === 'expense' ? 'default' : 'outline'}
                          className={`ml-2 ${field.value === 'expense' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                          onClick={() => field.onChange('expense')}
                        >
                          Expense
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="date"
                            {...field}
                          />
                          <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Example: Sales, Supplies..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialTracking;
