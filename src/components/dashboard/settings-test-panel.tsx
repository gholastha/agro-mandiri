'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, DatabaseIcon, AlertCircle, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

import {
  testAllSettingsTables,
  testStoreSettingsCRUD,
  testCreateStoreSettings,
  testUpdateStoreSettings,
  testReadStoreSettings,
  testCreatePaymentSetting,
  testTogglePaymentSetting,
  type TestResult,
  type SettingsTestReport,
  generateTestReport
} from '@/testing/dashboard/settings-test-utils';

// Result Card Component
function ResultCard({ result, getBadgeVariant }: { result: TestResult, getBadgeVariant: (success: boolean) => "destructive" | "default" | "outline" | "secondary" | null | undefined }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Card>
      <CardHeader className="p-3 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {result.success ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span>{result.message}</span>
            <Badge variant={getBadgeVariant(result.success)}>
              {result.success ? 'Sukses' : 'Gagal'}
            </Badge>
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="p-3">
          <div className="bg-muted p-4 rounded-md">
            <pre className="whitespace-pre-wrap break-all text-sm">
              {result.data ? (
                <div>
                  <strong>Data:</strong>
                  <div className="mt-2">
                    {JSON.stringify(result.data, null, 2)}
                  </div>
                </div>
              ) : null}
              {result.error ? (
                <div className="mt-2">
                  <strong>Error:</strong>
                  <div className="mt-2 text-red-500">
                    {JSON.stringify(result.error, null, 2)}
                  </div>
                </div>
              ) : null}
            </pre>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function SettingsTestPanel() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('database');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [report, setReport] = useState<SettingsTestReport | null>(null);
  
  // Form values for custom tests
  const [storeName, setStoreName] = useState(`Test Store ${Date.now()}`);
  const [storeEmail, setStoreEmail] = useState(`test-${Date.now()}@example.com`);
  const [paymentMethod, setPaymentMethod] = useState('Test Payment Method');
  
  // Run database structure tests
  const runDatabaseTests = async () => {
    setLoading(true);
    try {
      const results = await testAllSettingsTables();
      setTestResults(results);
      setReport(generateTestReport(results));
    } catch (error) {
      console.error('Error running database tests:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Run CRUD tests
  const runCRUDTests = async () => {
    setLoading(true);
    try {
      const results = await testStoreSettingsCRUD();
      setTestResults(results);
      setReport(generateTestReport(results));
    } catch (error) {
      console.error('Error running CRUD tests:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Run custom store settings test
  const runCustomStoreTest = async () => {
    setLoading(true);
    try {
      const results = [];
      
      // Create test store settings
      const createResult = await testCreateStoreSettings({
        store_name: storeName,
        contact_email: storeEmail
      });
      results.push(createResult);
      
      if (createResult.success && createResult.data?.id) {
        // Update the settings
        const updateResult = await testUpdateStoreSettings(
          createResult.data.id, 
          { store_description: `Updated description for ${storeName}` }
        );
        results.push(updateResult);
        
        // Read the settings
        const readResult = await testReadStoreSettings();
        results.push(readResult);
      }
      
      setTestResults(results);
      setReport(generateTestReport(results));
    } catch (error) {
      console.error('Error running custom store test:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Run custom payment settings test
  const runCustomPaymentTest = async () => {
    setLoading(true);
    try {
      const results = [];
      
      // Create payment setting
      const createResult = await testCreatePaymentSetting({
        display_name: paymentMethod,
        description: `Test description for ${paymentMethod}`,
        is_enabled: true
      });
      results.push(createResult);
      
      if (createResult.success && createResult.data?.id) {
        // Toggle the payment setting
        const toggleResult = await testTogglePaymentSetting(createResult.data.id);
        results.push(toggleResult);
      }
      
      setTestResults(results);
      setReport(generateTestReport(results));
    } catch (error) {
      console.error('Error running custom payment test:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to determine badge color based on test result
  const getBadgeVariant = (success: boolean) => {
    return success ? 'secondary' : 'destructive';
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <DatabaseIcon className="mr-2 h-5 w-5" />
          Pengujian Interaktif Database Pengaturan
        </CardTitle>
        <CardDescription>
          Alat untuk menguji interaksi database dengan komponen pengaturan dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="database">Struktur Database</TabsTrigger>
            <TabsTrigger value="crud">CRUD Test</TabsTrigger>
            <TabsTrigger value="custom-store">Custom Store</TabsTrigger>
            <TabsTrigger value="custom-payment">Custom Payment</TabsTrigger>
          </TabsList>
          
          {/* Database Structure Tests */}
          <TabsContent value="database" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Pengujian Struktur Database</AlertTitle>
              <AlertDescription>
                Pengujian ini akan memeriksa eksistensi dan struktur tabel pengaturan di database.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={runDatabaseTests} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menjalankan Pengujian...
                </>
              ) : (
                'Jalankan Pengujian Struktur Database'
              )}
            </Button>
          </TabsContent>
          
          {/* CRUD Tests */}
          <TabsContent value="crud" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Pengujian CRUD Pengaturan Toko</AlertTitle>
              <AlertDescription>
                Pengujian ini akan melakukan operasi Create, Read, Update pada pengaturan toko.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={runCRUDTests} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menjalankan Pengujian...
                </>
              ) : (
                'Jalankan Pengujian CRUD'
              )}
            </Button>
          </TabsContent>
          
          {/* Custom Store Tests */}
          <TabsContent value="custom-store" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Pengujian Kustom Pengaturan Toko</AlertTitle>
              <AlertDescription>
                Uji pengaturan toko dengan data kustom Anda sendiri.
              </AlertDescription>
            </Alert>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="store_name">Nama Toko Uji</Label>
                  <Input
                    id="store_name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Nama toko uji"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store_email">Email Toko Uji</Label>
                  <Input
                    id="store_email"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <Button 
                onClick={runCustomStoreTest} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menjalankan Pengujian...
                  </>
                ) : (
                  'Jalankan Pengujian Kustom Toko'
                )}
              </Button>
            </div>
          </TabsContent>
          
          {/* Custom Payment Tests */}
          <TabsContent value="custom-payment" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Pengujian Kustom Metode Pembayaran</AlertTitle>
              <AlertDescription>
                Uji pengaturan metode pembayaran dengan data kustom Anda sendiri.
              </AlertDescription>
            </Alert>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payment_method">Nama Metode Pembayaran</Label>
                <Input
                  id="payment_method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  placeholder="Nama metode pembayaran uji"
                />
              </div>
              <Button 
                onClick={runCustomPaymentTest} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menjalankan Pengujian...
                  </>
                ) : (
                  'Jalankan Pengujian Kustom Pembayaran'
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Test Results */}
        {report && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Hasil Pengujian</h3>
              <div className="flex space-x-2">
                <Badge variant="outline">Total: {report.summary.total}</Badge>
                <Badge variant="secondary">Sukses: {report.summary.passed}</Badge>
                <Badge variant="destructive">Gagal: {report.summary.failed}</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <ResultCard 
                  key={index} 
                  result={result} 
                  getBadgeVariant={getBadgeVariant} 
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Diperbarui terakhir: {report ? new Date(report.timestamp).toLocaleString('id-ID') : new Date().toLocaleString('id-ID')}
        </p>
      </CardFooter>
    </Card>
  );
}
