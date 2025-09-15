import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Globe,
  Palette,
  Download,
  Upload,
  Trash2,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/layout/PageHeader';
import { EditableField } from '@/components/ui/editable-field';
import { usePageMetadata } from '@/hooks/use-page-metadata';

const SettingsPage = () => {
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Settings & Configuration',
    defaultDescription: 'Manage your application settings, preferences, and system configuration'
  });

  // User Profile Settings
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    organization: 'Green Valley Farms',
    role: 'Farm Manager'
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    weatherAlerts: true,
    harvestReminders: true,
    inventoryAlerts: true,
    financialReports: false
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    language: 'en',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    units: 'imperial',
    theme: 'light',
    autoSave: true,
    dataRetention: '1year'
  });

  const handleSaveSettings = (section: string) => {
    toast.success('Settings Saved', {
      description: `${section} settings have been updated successfully`
    });
  };

  const handleExportData = () => {
    toast.success('Data Export Started', {
      description: 'Your data export has been initiated'
    });
  };

  const handleImportData = () => {
    toast.success('Data Import', {
      description: 'Data import functionality will be available soon'
    });
  };

  const handleResetSettings = () => {
    toast.warning('Settings Reset', {
      description: 'All settings have been reset to default values'
    });
  };

  return (
    <PageLayout>
      <div className="p-6 animate-enter">
        <PageHeader 
          title={title}
          description={description}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          icon={<Settings className="h-6 w-6" />}
        />

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>

          {/* Profile Settings Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  User Profile
                </CardTitle>
                <CardDescription>
                  Manage your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      value={userProfile.organization}
                      onChange={(e) => setUserProfile({...userProfile, organization: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={() => handleSaveSettings('Profile')} className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important updates via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailAlerts}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, emailAlerts: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive urgent notifications via SMS
                      </p>
                    </div>
                    <Switch
                      checked={notifications.smsAlerts}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, smsAlerts: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive browser push notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, pushNotifications: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weather Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about weather changes
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weatherAlerts}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, weatherAlerts: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Harvest Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Reminders for harvest schedules
                      </p>
                    </div>
                    <Switch
                      checked={notifications.harvestReminders}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, harvestReminders: checked})
                      }
                    />
                  </div>
                </div>
                <Button onClick={() => handleSaveSettings('Notifications')} className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  System Preferences
                </CardTitle>
                <CardDescription>
                  Configure language, timezone, and display preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={systemSettings.language} onValueChange={(value) => 
                      setSystemSettings({...systemSettings, language: value})
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="hi">हिन्दी</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={systemSettings.timezone} onValueChange={(value) => 
                      setSystemSettings({...systemSettings, timezone: value})
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC+5:30">India Standard Time (UTC+5:30)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={systemSettings.currency} onValueChange={(value) => 
                      setSystemSettings({...systemSettings, currency: value})
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (₹)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="units">Measurement Units</Label>
                    <Select value={systemSettings.units} onValueChange={(value) => 
                      setSystemSettings({...systemSettings, units: value})
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imperial">Imperial (ft, lbs)</SelectItem>
                        <SelectItem value="metric">Metric (m, kg)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-save</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save changes as you work
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.autoSave}
                    onCheckedChange={(checked) => 
                      setSystemSettings({...systemSettings, autoSave: checked})
                    }
                  />
                </div>
                
                <Button onClick={() => handleSaveSettings('System')} className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Save System Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="h-5 w-5 mr-2" />
                    Data Export
                  </CardTitle>
                  <CardDescription>
                    Export your data for backup or migration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Download all your farm data including crops, inventory, financial records, and settings.
                  </p>
                  <Button onClick={handleExportData} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Data Import
                  </CardTitle>
                  <CardDescription>
                    Import data from other systems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Import data from CSV files or other agricultural management systems.
                  </p>
                  <Button onClick={handleImportData} variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                  <Trash2 className="h-5 w-5 mr-2" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions that affect your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <h4 className="font-semibold text-destructive mb-2">Reset All Settings</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    This will reset all your settings to their default values. Your data will not be affected.
                  </p>
                  <Button 
                    onClick={handleResetSettings} 
                    variant="destructive" 
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Reset Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
