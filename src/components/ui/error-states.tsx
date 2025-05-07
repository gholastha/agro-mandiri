import { Button } from './button';
import { 
  AlertTriangle,
  ServerCrash,
  WifiOff,
  Lock,
  Ban
} from 'lucide-react';

type ErrorType = 'general' | 'network' | 'server' | 'permission' | 'empty';

interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  type = 'general',
  title,
  message,
  onRetry 
}: ErrorStateProps) {
  // Default messages based on error type
  const errorInfo = {
    general: {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: title || 'Terjadi Kesalahan',
      message: message || 'Terjadi kesalahan saat memuat data. Silakan coba lagi.',
      color: 'bg-yellow-100 text-yellow-600'
    },
    network: {
      icon: <WifiOff className="h-5 w-5" />,
      title: title || 'Koneksi Terputus',
      message: message || 'Periksa koneksi internet Anda dan coba lagi.',
      color: 'bg-red-100 text-red-600'
    },
    server: {
      icon: <ServerCrash className="h-5 w-5" />,
      title: title || 'Kesalahan Server',
      message: message || 'Server sedang mengalami masalah. Silakan coba lagi nanti.',
      color: 'bg-red-100 text-red-600'
    },
    permission: {
      icon: <Lock className="h-5 w-5" />,
      title: title || 'Akses Dibatasi',
      message: message || 'Anda tidak memiliki izin untuk mengakses data ini.',
      color: 'bg-orange-100 text-orange-600'
    },
    empty: {
      icon: <Ban className="h-5 w-5" />,
      title: title || 'Data Kosong',
      message: message || 'Tidak ada data yang tersedia.',
      color: 'bg-blue-100 text-blue-600'
    }
  };
  
  const { icon, title: defaultTitle, message: defaultMessage, color } = errorInfo[type];
  
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${color}`}>
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{defaultTitle}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {defaultMessage}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-4">
          Coba Lagi
        </Button>
      )}
    </div>
  );
}
