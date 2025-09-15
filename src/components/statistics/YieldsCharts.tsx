import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useStatistics } from '../../contexts/StatisticsContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Download, Camera, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import TechnicalSheetButton from '../common/TechnicalSheetButton';

const YieldsCharts = () => {
  const { yieldData, period } = useStatistics();
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  // Format data for comparative chart
  const comparativeData = yieldData.map(item => ({
    name: item.name,
    current: item.current,
    previous: item.previous,
    difference: item.current - item.previous,
    unit: item.unit
  }));

  // Historical data for several years (simulated)
  const historicalData = [
    { year: '2018', 'Sugarcane': 70, 'Cotton': 28, 'Rice': 40, 'Wheat': 14, 'Maize': 18 },
    { year: '2019', 'Sugarcane': 72, 'Cotton': 29, 'Rice': 42, 'Wheat': 15, 'Maize': 19 },
    { year: '2020', 'Sugarcane': 75, 'Cotton': 30, 'Rice': 48, 'Wheat': 15, 'Maize': 20 },
    { year: '2021', 'Sugarcane': 78, 'Cotton': 31, 'Rice': 47, 'Wheat': 16, 'Maize': 21 },
    { year: '2022', 'Sugarcane': 82, 'Cotton': 31, 'Rice': 46, 'Wheat': 17, 'Maize': 21 },
    { year: '2023', 'Sugarcane': 85, 'Cotton': 32, 'Rice': 45, 'Wheat': 18, 'Maize': 22 }
  ];

  // Generate colors for each crop
  const colors = {
    'Sugarcane': '#4CAF50',
    'Cotton': '#FFC107',
    'Rice': '#F44336',
    'Wheat': '#9C27B0',
    'Maize': '#2196F3'
  };

  // Capture and export chart (simulation)
  const handleExportChart = (chartName: string) => {
    toast.success(`Chart exported`, {
      description: `The chart "${chartName}" has been downloaded in PNG format`
    });
  };

  // Share chart (simulation)
  const handleShareChart = (chartName: string) => {
    toast.success(`Chart shared`, {
      description: `The link to chart "${chartName}" has been copied to clipboard`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Current vs Previous Yields</CardTitle>
            <CardDescription>Comparison of current yields with previous period</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex rounded-md border overflow-hidden">
              <Button
                variant={chartType === 'bar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('bar')}
                className={chartType === 'bar' ? 'rounded-none' : 'rounded-none hover:bg-muted/50'}
              >
                Bars
              </Button>
              <Button
                variant={chartType === 'line' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('line')}
                className={chartType === 'line' ? 'rounded-none' : 'rounded-none hover:bg-muted/50'}
              >
                Lines
              </Button>
            </div>
            <Button variant="outline" size="icon" onClick={() => handleExportChart('Comparative Yields')}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleShareChart('Comparative Yields')}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart
                  data={comparativeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name, props) => {
                      if (name === 'difference') {
                        return [`${Number(value) > 0 ? '+' : ''}${value} ${props.payload.unit}`, 'Evolution'];
                      }
                      return [`${value} ${props.payload.unit}`, name];
                    }}
                  />
                  <Legend />
                  <Bar name="Current Yield" dataKey="current" fill="#4CAF50" />
                  <Bar name="Previous Yield" dataKey="previous" fill="#8D6E63" />
                </BarChart>
              ) : (
                <LineChart
                  data={comparativeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name, props) => {
                      if (name === 'difference') {
                        return [`${Number(value) > 0 ? '+' : ''}${value} ${props.payload.unit}`, 'Evolution'];
                      }
                      return [`${value} ${props.payload.unit}`, name];
                    }}
                  />
                  <Legend />
                  <Line type="monotone" name="Current Yield" dataKey="current" stroke="#4CAF50" strokeWidth={2} />
                  <Line type="monotone" name="Previous Yield" dataKey="previous" stroke="#8D6E63" strokeWidth={2} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Historical Yield Evolution ({period === 'year' ? 'annual' : 'monthly'})</CardTitle>
            <CardDescription>Trend of yields over several years</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => handleExportChart('Historical Evolution')}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleShareChart('Historical Evolution')}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={historicalData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} t/ha`, '']} />
                <Legend />
                {Object.keys(colors).map((crop) => (
                  <Line
                    key={crop}
                    type="monotone"
                    dataKey={crop}
                    stroke={colors[crop as keyof typeof colors]}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {yieldData.map((item) => {
          const change = item.current - item.previous;
          const changePercent = ((change / item.previous) * 100).toFixed(1);
          const isPositive = change >= 0;
          
          return (
            <Card key={item.name}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-base flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[item.name as keyof typeof colors] || '#4CAF50' }}></span>
                    {item.name}
                  </CardTitle>
                  <TechnicalSheetButton 
                    data={{ 
                      name: item.name,
                      currentYield: item.current,
                      previousYield: item.previous,
                      unit: item.unit
                    }} 
                    variant="outline"
                    className="h-8 w-8 p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </TechnicalSheetButton>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">{item.current} {item.unit}</div>
                <div className={`text-sm flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{isPositive ? '+' : ''}{change} {item.unit} ({isPositive ? '+' : ''}{changePercent}%)</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default YieldsCharts;