import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Filter,
  Printer,
  Share2,
  Eye,
  FileSpreadsheet,
  File,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/layout/PageHeader';
import { EditableField } from '@/components/ui/editable-field';
import { usePageMetadata } from '@/hooks/use-page-metadata';

const ReportsPage = () => {
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Reports & Analytics',
    defaultDescription: 'Generate comprehensive reports and analytics for your agricultural operations'
  });

  const [selectedReportType, setSelectedReportType] = useState('financial');
  const [dateRange, setDateRange] = useState('last-month');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample report data
  const reportTemplates = [
    {
      id: 'financial',
      title: 'Financial Report',
      description: 'Comprehensive financial analysis including revenue, expenses, and profitability',
      icon: <TrendingUp className="h-5 w-5" />,
      category: 'Finance',
      lastGenerated: '2024-01-15',
      status: 'available'
    },
    {
      id: 'yield',
      title: 'Yield Analysis',
      description: 'Crop yield performance and productivity metrics across all fields',
      icon: <BarChart3 className="h-5 w-5" />,
      category: 'Crops',
      lastGenerated: '2024-01-10',
      status: 'available'
    },
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Stock levels, usage patterns, and procurement recommendations',
      icon: <FileText className="h-5 w-5" />,
      category: 'Inventory',
      lastGenerated: '2024-01-12',
      status: 'available'
    },
    {
      id: 'weather',
      title: 'Weather Impact',
      description: 'Weather patterns and their impact on crop performance',
      icon: <Calendar className="h-5 w-5" />,
      category: 'Environment',
      lastGenerated: '2024-01-08',
      status: 'available'
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: 'Financial Summary Q4 2023',
      type: 'Financial Report',
      generated: '2024-01-15',
      size: '2.3 MB',
      format: 'PDF'
    },
    {
      id: 2,
      name: 'Yield Analysis - Rice Fields',
      type: 'Yield Analysis',
      generated: '2024-01-10',
      size: '1.8 MB',
      format: 'Excel'
    },
    {
      id: 3,
      name: 'Inventory Status Report',
      type: 'Inventory Report',
      generated: '2024-01-12',
      size: '1.2 MB',
      format: 'PDF'
    }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('Report Generated', {
        description: `${selectedReportType} report has been generated successfully`
      });
    }, 2000);
  };

  const handleDownloadReport = (reportId: number) => {
    toast.success('Download Started', {
      description: 'Your report download has started'
    });
  };

  const handlePreviewReport = (reportId: number) => {
    toast.info('Preview Available', {
      description: 'Report preview is now available'
    });
  };

  const handleShareReport = (reportId: number) => {
    toast.success('Share Link Generated', {
      description: 'Shareable link has been copied to clipboard'
    });
  };

  const renderReportTemplates = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reportTemplates.map((template) => (
        <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {template.icon}
                <CardTitle className="text-lg">{template.title}</CardTitle>
              </div>
              <Badge variant={template.status === 'available' ? 'default' : 'secondary'}>
                {template.status}
              </Badge>
            </div>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category:</span>
                <span>{template.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Generated:</span>
                <span>{template.lastGenerated}</span>
              </div>
              <Button 
                className="w-full" 
                onClick={() => setSelectedReportType(template.id)}
                variant={selectedReportType === template.id ? 'default' : 'outline'}
              >
                {selectedReportType === template.id ? 'Selected' : 'Select'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderRecentReports = () => (
    <div className="space-y-4">
      {recentReports.map((report) => (
        <Card key={report.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{report.name}</h3>
                <p className="text-sm text-muted-foreground">{report.type}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  <span>Generated: {report.generated}</span>
                  <span>Size: {report.size}</span>
                  <span>Format: {report.format}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={() => handlePreviewReport(report.id)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDownloadReport(report.id)}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleShareReport(report.id)}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderReportGenerator = () => (
    <Card>
      <CardHeader>
        <CardTitle>Generate New Report</CardTitle>
        <CardDescription>Configure and generate a new report</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={selectedReportType} onValueChange={setSelectedReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date-range">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-quarter">Last Quarter</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="format">Output Format</Label>
          <div className="flex space-x-4">
            <Button
              variant={reportFormat === 'pdf' ? 'default' : 'outline'}
              onClick={() => setReportFormat('pdf')}
              className="flex items-center space-x-2"
            >
              <File className="h-4 w-4" />
              <span>PDF</span>
            </Button>
            <Button
              variant={reportFormat === 'excel' ? 'default' : 'outline'}
              onClick={() => setReportFormat('excel')}
              className="flex items-center space-x-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Excel</span>
            </Button>
            <Button
              variant={reportFormat === 'image' ? 'default' : 'outline'}
              onClick={() => setReportFormat('image')}
              className="flex items-center space-x-2"
            >
              <Image className="h-4 w-4" />
              <span>Image</span>
            </Button>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button 
            onClick={handleGenerateReport} 
            disabled={isGenerating}
            className="flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                <span>Generate Report</span>
              </>
            )}
          </Button>
          
          <Button variant="outline" className="flex items-center space-x-2">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout>
      <div className="p-6 animate-enter">
        <PageHeader 
          title={title}
          description={description}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          icon={<FileText className="h-6 w-6" />}
        />

        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
            <TabsTrigger value="recent">Recent Reports</TabsTrigger>
            <TabsTrigger value="generator">Generate New</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Available Report Templates</h2>
              <p className="text-muted-foreground mb-6">
                Choose from our comprehensive collection of report templates designed for agricultural operations.
              </p>
              {renderReportTemplates()}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Reports</h2>
              <p className="text-muted-foreground mb-6">
                Access and manage your recently generated reports.
              </p>
              {renderRecentReports()}
            </div>
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Report Generator</h2>
              <p className="text-muted-foreground mb-6">
                Create custom reports with your preferred settings and parameters.
              </p>
              {renderReportGenerator()}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ReportsPage;
