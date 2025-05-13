'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, DatabaseIcon, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SettingsTestPanel from '@/components/dashboard/settings-test-panel';
import SettingsSetupPanel from '@/components/dashboard/settings-setup-panel';

export default function SettingsTestPage() {
  const [activeTab, setActiveTab] = useState('setup');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pengaturan & Pengujian Database</h1>
          <Breadcrumb items={[
            { label: 'Admin', href: '/admin', isCurrent: false },
            { label: 'Pengaturan', href: '/admin/settings', isCurrent: false },
            { label: 'Database', href: '/admin/settings/test', isCurrent: true }
          ]} className="text-sm text-muted-foreground" />
        </div>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Perhatian</AlertTitle>
        <AlertDescription>
          Halaman ini hanya untuk keperluan pengaturan dan pengujian database. Fitur-fitur di halaman ini akan membuat dan mengubah data di database.
          Jalankan "Setup Database" terlebih dahulu untuk membuat tabel-tabel yang diperlukan sebelum melakukan pengujian.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="setup" className="flex items-center space-x-2">
            <DatabaseIcon className="h-4 w-4" />
            <span>Setup Database</span>
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Pengujian Interaktif</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup" className="space-y-4">
          <SettingsSetupPanel />
        </TabsContent>
        
        <TabsContent value="test" className="space-y-4">
          <SettingsTestPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
