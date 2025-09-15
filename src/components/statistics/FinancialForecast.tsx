import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  ReferenceLine
} from 'recharts';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calculator, RefreshCw, TrendingUp, Share2 } from "lucide-react";

// Forecast data for the next 12 months
const forecastData = [
  { month: 'Jan', revenue: 28500, expenses: 20100, forecast: 8400, previous: 7200 },
  { month: 'Feb', revenue: 30200, expenses: 21800, forecast: 8400, previous: 7500 },
  { month: 'Mar', revenue: 32800, expenses: 22400, forecast: 10400, previous: 8200 },
  { month: 'Apr', revenue: 35500, expenses: 23100, forecast: 12400, previous: 9200 },
  { month: 'May', revenue: 38200, expenses: 23500, forecast: 14700, previous: 10700 },
  { month: 'June', revenue: 37800, expenses: 22900, forecast: 14900, previous: 11200 },
  { month: 'Jul', revenue: 42500, expenses: 24200, forecast: 18300, previous: 12400 },
  { month: 'August', revenue: 44800, expenses: 25300, forecast: 19500, previous: 13100 },
  { month: 'Sep', revenue: 40200, expenses: 24800, forecast: 15400, previous: 12400 },
  { month: 'Oct', revenue: 38200, expenses: 23100, forecast: 15100, previous: 11800 },
  { month: 'Nov', revenue: 36500, expenses: 22500, forecast: 14000, previous: 10900 },
  { month: 'Dec', revenue: 41200, expenses: 25800, forecast: 15400, previous: 12200 }
];

// Cash flow projection data
const cashFlowProjection = [
  { month: 'Jan', inflow: 28500, outflow: 20100, balance: 8400 },
  { month: 'Feb', inflow: 30200, outflow: 21800, balance: 16800 },
  { month: 'Mar', inflow: 32800, outflow: 22400, balance: 27200 },
  { month: 'Apr', inflow: 35500, outflow: 23100, balance: 39600 },
  { month: 'May', inflow: 38200, outflow: 23500, balance: 54300 },
  { month: 'June', inflow: 37800, outflow: 22900, balance: 69200 },
  { month: 'Jul', inflow: 42500, outflow: 24200, balance: 87500 },
  { month: 'August', inflow: 44800, outflow: 25300, balance: 107000 },
  { month: 'Sep', inflow: 40200, outflow: 24800, balance: 122400 },
  { month: 'Oct', inflow: 38200, outflow: 23100, balance: 137500 },
  { month: 'Nov', inflow: 36500, outflow: 22500, balance: 151500 },
  { month: 'Dec', inflow: 41200, outflow: 25800, balance: 166900 }
];

const FinancialForecast = () => {
  const [forecastDuration, setForecastDuration] = useState<string>("12");
  const [revenueFactor, setRevenueFactor] = useState<number[]>([100]);
  const [expenseFactor, setExpenseFactor] = useState<number[]>([100]);
  const [revenueScenario, setRevenueScenario] = useState<string>("stable");
  const [forecastModel, setForecastModel] = useState<string>("basic");
  
  const handleRefreshForecast = () => {
    toast.info("Updating financial forecasts");
    // In a real app, this would recalculate forecasts based on the selected factors
  };
  
  const handleShareForecast = () => {
    toast.success("Forecasts shared by email");
  };
  
  const handleRunSimulation = () => {
    toast.success("Simulation launched successfully");
    // In a real app, this would run a more sophisticated forecast model
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold">Financial Forecasts</h2>
          <p className="text-muted-foreground">Projections for {forecastDuration} months based on historical data</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={forecastDuration} onValueChange={setForecastDuration}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 months</SelectItem>
              <SelectItem value="6">6 months</SelectItem>
              <SelectItem value="12">12 months</SelectItem>
              <SelectItem value="24">24 months</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={forecastModel} onValueChange={setForecastModel}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic Model</SelectItem>
              <SelectItem value="seasonal">Seasonal Model</SelectItem>
              <SelectItem value="advanced">Advanced Model</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleRefreshForecast} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button onClick={handleShareForecast} variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Projected Net Margin</CardTitle>
            <CardDescription>Comparison with previous year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={forecastData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === "forecast") return [`${value.toLocaleString()} ₹`, "Forecast"];
                      if (name === "previous") return [`${value.toLocaleString()} ₹`, "Previous Year"];
                      return [`${value.toLocaleString()} ₹`, name];
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#4CAF50" 
                    strokeWidth={2} 
                    name="Forecast" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previous" 
                    stroke="#9E9E9E" 
                    strokeDasharray="5 5" 
                    name="Previous Year" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Forecast</CardTitle>
            <CardDescription>Evolution of cash balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={cashFlowProjection}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()} ₹`, '']}
                  />
                  <Legend />
                  <ReferenceLine y={0} stroke="#000" />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                    name="Cash Balance"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Simulation Settings</CardTitle>
          <CardDescription>Adjust factors to observe their impact on forecasts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Revenue Evolution</Label>
                    <span className="text-sm font-medium">{revenueFactor[0]}%</span>
                  </div>
                  <Slider 
                    value={revenueFactor} 
                    onValueChange={setRevenueFactor} 
                    min={70} 
                    max={130} 
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>-30%</span>
                    <span>Stable</span>
                    <span>+30%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Expense Evolution</Label>
                    <span className="text-sm font-medium">{expenseFactor[0]}%</span>
                  </div>
                  <Slider 
                    value={expenseFactor} 
                    onValueChange={setExpenseFactor} 
                    min={70} 
                    max={130} 
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>-30%</span>
                    <span>Stable</span>
                    <span>+30%</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Revenue Scenario</Label>
                  <Select value={revenueScenario} onValueChange={setRevenueScenario}>
                    <SelectTrigger>
                      <SelectValue placeholder="Scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="optimistic">Optimistic (+15%)</SelectItem>
                      <SelectItem value="stable">Stable (±0%)</SelectItem>
                      <SelectItem value="pessimistic">Pessimistic (-15%)</SelectItem>
                      <SelectItem value="seasonal">Seasonal (variations)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button className="w-full" onClick={handleRunSimulation}>
                    <Calculator className="h-4 w-4 mr-2" />
                    Run Simulation
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 border rounded-lg">
                <p className="text-muted-foreground text-sm font-medium mb-1">Projected Farm Result</p>
                <p className="text-xl font-bold">98,600 ₹</p>
                <div className="flex items-center space-x-1 text-green-600 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12% vs previous year</span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <p className="text-muted-foreground text-sm font-medium mb-1">Projected Year-End Cash</p>
                <p className="text-xl font-bold">166,900 ₹</p>
                <div className="flex items-center space-x-1 text-green-600 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  <span>+32% vs previous year</span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <p className="text-muted-foreground text-sm font-medium mb-1">Projected Profitability</p>
                <p className="text-xl font-bold">21.3%</p>
                <div className="flex items-center space-x-1 text-green-600 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  <span>+3.2pts vs previous year</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialForecast;