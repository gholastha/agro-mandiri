import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { format, subDays, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';

type SalesData = {
  date: string;
  amount: number;
  prevAmount?: number;
};

type Period = '7days' | '30days' | 'month';

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
}

type SalesTrendChartProps = {
  data: Order[];
  isLoading: boolean;
};

export function SalesTrendChart({ data = [], isLoading }: SalesTrendChartProps) {
  const [period, setPeriod] = useState<Period>('30days');
  
  // Process data based on selected period
  const chartData = data.length > 0 ? processChartData(data, period) : [];
  
  // Calculate percentage change
  const totalCurrent = chartData.reduce((sum, day) => sum + day.amount, 0);
  const totalPrevious = chartData.reduce((sum, day) => sum + (day.prevAmount || 0), 0);
  const percentChange = totalPrevious > 0 
    ? ((totalCurrent - totalPrevious) / totalPrevious) * 100 
    : 0;
  
  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <CardTitle>Tren Penjualan</CardTitle>
          {!isLoading && data.length > 0 && (
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-sm font-medium ${
                percentChange >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {percentChange >= 0 ? '↑' : '↓'} {Math.abs(percentChange).toFixed(1)}%
              </span>
              <span className="text-sm text-muted-foreground">
                dibanding periode sebelumnya
              </span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2 mt-3 sm:mt-0">
          <Button 
            variant={period === '7days' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPeriod('7days')}
          >
            7 Hari
          </Button>
          <Button 
            variant={period === '30days' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPeriod('30days')}
          >
            30 Hari
          </Button>
          <Button 
            variant={period === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPeriod('month')}
          >
            Bulan Ini
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-80 w-full animate-pulse rounded-md bg-muted" />
        ) : data.length === 0 ? (
          <div className="flex h-80 flex-col items-center justify-center text-center p-8">
            <p className="text-muted-foreground">Belum ada data penjualan untuk ditampilkan</p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)} 
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Tanggal: ${label}`}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="prevAmount" 
                  name="Periode Sebelumnya" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.1}  
                  strokeDasharray="5 5"
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  name="Periode Ini" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to process chart data
function processChartData(data: Order[], period: Period): SalesData[] {
  const now = new Date();
  let interval;

  
  // Define current interval
  switch (period) {
    case '7days':
      interval = { start: subDays(now, 7), end: now };
      break;
    case '30days':
      interval = { start: subDays(now, 30), end: now };
      break;
    case 'month':
      interval = { start: startOfMonth(now), end: endOfMonth(now) };
      break;
  }
  
  // Generate date range
  const days = eachDayOfInterval(interval);
  
  // Aggregate data by date
  return days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    
    // Current period
    const dayOrders = data.filter(order => 
      order.created_at.startsWith(dayStr)
    );
    const dayAmount = dayOrders.reduce((sum, order) => sum + order.total_amount, 0);
    
    // Previous period (for comparison)
    const prevDay = period === 'month' 
      ? new Date(day.getFullYear(), day.getMonth() - 1, day.getDate())
      : subDays(day, days.length);
    
    const prevDayStr = format(prevDay, 'yyyy-MM-dd');
    const prevDayOrders = data.filter(order => 
      order.created_at.startsWith(prevDayStr)
    );
    const prevDayAmount = prevDayOrders.reduce((sum, order) => sum + order.total_amount, 0);
    
    return {
      date: format(day, 'dd MMM'),
      amount: dayAmount,
      prevAmount: prevDayAmount
    };
  });
}
