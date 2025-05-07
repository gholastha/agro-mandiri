import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Order } from '@/api/types/orders';

interface ExportDataProps {
  data: Order[];
  filename?: string;
  isLoading?: boolean;
}

export function ExportData({ 
  data, 
  filename = 'orders-export', 
  isLoading = false 
}: ExportDataProps) {
  const handleExport = () => {
    if (!data || data.length === 0) return;
    
    // Format data for CSV
    const csvData = data.map(order => ({
      ID: order.id,
      Tanggal: new Date(order.created_at).toLocaleDateString('id-ID'),
      Status: order.status,
      StatusPembayaran: order.payment_status,
      Total: order.total_amount,
      MetodePembayaran: order.payment_method,
      Alamat: order.shipping_address
    }));
    
    // Convert to CSV
    const rows = [
      // Header row
      Object.keys(csvData[0]).join(','),
      // Data rows
      ...csvData.map(row => 
        Object.values(row)
          .map(value => `"${value}"`)
          .join(',')
      )
    ];
    
    const csvContent = rows.join('\n');
    
    // Create file and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isLoading || !data || data.length === 0}
    >
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  );
}
