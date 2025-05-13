'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, DatabaseIcon, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

import { 
  createSettingsTables, 
  initializeDefaultSettings,
  setupSettingsTables
} from '@/database/utils/applyMigrations';

interface SetupResult {
  success: boolean;
  message: string;
  details?: any;
  error?: any;
}

export default function SettingsSetupPanel() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SetupResult[]>([]);
  const [setupComplete, setSetupComplete] = useState(false);
  
  // Run the full setup process
  const runFullSetup = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      // Create the setup result entry
      const setupEntry: SetupResult = {
        success: false,
        message: 'Menjalankan pengaturan database...'
      };
      setResults([setupEntry]);
      
      // Run the setup
      const result = await setupSettingsTables();
      
      // Update the result
      setupEntry.success = result.success;
      setupEntry.message = result.message;
      setupEntry.details = {
        tablesResult: result.tablesResult,
        initResult: result.initResult
      };
      
      if (!result.success && result.error) {
        setupEntry.error = result.error;
      }
      
      setResults([setupEntry]);
      setSetupComplete(result.success);
    } catch (error) {
      setResults([{
        success: false,
        message: 'Terjadi kesalahan saat menjalankan pengaturan',
        error
      }]);
    } finally {
      setLoading(false);
    }
  };
  
  // Create tables only
  const createTablesOnly = async () => {
    setLoading(true);
    
    try {
      // Create the setup result entry
      const setupEntry: SetupResult = {
        success: false,
        message: 'Membuat tabel pengaturan...'
      };
      setResults(prev => [...prev, setupEntry]);
      
      // Create tables
      const result = await createSettingsTables();
      
      // Update the result
      setupEntry.success = result.success;
      setupEntry.message = result.message;
      
      if (!result.success && result.error) {
        setupEntry.error = result.error;
      }
      
      setResults(prev => 
        prev.map(r => (r === setupEntry ? setupEntry : r))
      );
    } catch (error) {
      setResults(prev => [
        ...prev,
        {
          success: false,
          message: 'Terjadi kesalahan saat membuat tabel',
          error
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  // Initialize default data only
  const initializeDataOnly = async () => {
    setLoading(true);
    
    try {
      // Create the setup result entry
      const setupEntry: SetupResult = {
        success: false,
        message: 'Menginisialisasi data default...'
      };
      setResults(prev => [...prev, setupEntry]);
      
      // Initialize default data
      const result = await initializeDefaultSettings();
      
      // Update the result
      setupEntry.success = result.success;
      setupEntry.message = result.message;
      
      if (!result.success && result.error) {
        setupEntry.error = result.error;
      }
      
      setResults(prev => 
        prev.map(r => (r === setupEntry ? setupEntry : r))
      );
    } catch (error) {
      setResults(prev => [
        ...prev,
        {
          success: false,
          message: 'Terjadi kesalahan saat menginisialisasi data',
          error
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <DatabaseIcon className="mr-2 h-5 w-5" />
          Pengaturan Database Agro Mandiri
        </CardTitle>
        <CardDescription>
          Buat dan inisialisasi tabel database untuk pengaturan aplikasi Agro Mandiri
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Perhatian</AlertTitle>
          <AlertDescription>
            Pastikan Anda memiliki akses admin ke database Supabase. Proses ini akan membuat tabel-tabel settings 
            yang diperlukan untuk aplikasi Agro Mandiri.
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Button 
            onClick={runFullSetup} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menjalankan...
              </>
            ) : (
              <>
                <DatabaseIcon className="mr-2 h-4 w-4" />
                Setup Lengkap
              </>
            )}
          </Button>
          
          <Button 
            onClick={createTablesOnly} 
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Membuat Tabel...
              </>
            ) : (
              'Buat Tabel Saja'
            )}
          </Button>
          
          <Button 
            onClick={initializeDataOnly} 
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengisi Data...
              </>
            ) : (
              'Inisialisasi Data Saja'
            )}
          </Button>
        </div>
        
        {results.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Hasil Eksekusi</h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <Card key={index} className={result.success ? 'border-green-500/50' : 'border-red-500/50'}>
                  <CardHeader className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {result.success ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-medium">{result.message}</span>
                      </div>
                      <Badge variant={result.success ? 'secondary' : 'destructive'}>
                        {result.success ? 'Sukses' : 'Gagal'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  {(result.details || result.error) && (
                    <CardContent className="p-3 pt-0">
                      {result.details && (
                        <div className="mb-2">
                          <strong className="text-sm">Detail:</strong>
                          <pre className="mt-1 whitespace-pre-wrap bg-muted p-2 rounded-md text-xs">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </div>
                      )}
                      {result.error && (
                        <div>
                          <strong className="text-sm">Error:</strong>
                          <pre className="mt-1 whitespace-pre-wrap bg-red-50 text-red-900 p-2 rounded-md text-xs">
                            {JSON.stringify(result.error, null, 2)}
                          </pre>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {setupComplete && (
          <Alert className="bg-green-50 text-green-900 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Pengaturan Database Selesai</AlertTitle>
            <AlertDescription>
              Semua tabel pengaturan telah dibuat dan diinisialisasi dengan data default.
              Anda sekarang dapat menggunakan fitur pengujian database pengaturan.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Pengaturan database diperlukan sebelum menggunakan fitur pengujian database.
        </p>
      </CardFooter>
    </Card>
  );
}
