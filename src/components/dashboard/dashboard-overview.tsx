import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DashboardOverviewProps {
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  previousPeriodComparison: {
    revenue: { value: number; isPositive: boolean };
    orders: { value: number; isPositive: boolean };
    aov: { value: number; isPositive: boolean };
    conversion: { value: number; isPositive: boolean };
  };
  isLoading?: boolean;
}

export function DashboardOverview({ 
  metrics, 
  previousPeriodComparison,
  isLoading = false 
}: DashboardOverviewProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Ringkasan Performa</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Total Pendapatan</div>
              <div className="text-3xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
              <div className={`flex items-center text-xs ${
                previousPeriodComparison.revenue.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {previousPeriodComparison.revenue.isPositive ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )}
                <span>{Math.abs(previousPeriodComparison.revenue.value).toFixed(1)}% dari periode lalu</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Total Pesanan</div>
              <div className="text-3xl font-bold">{metrics.totalOrders}</div>
              <div className={`flex items-center text-xs ${
                previousPeriodComparison.orders.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {previousPeriodComparison.orders.isPositive ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )}
                <span>{Math.abs(previousPeriodComparison.orders.value).toFixed(1)}% dari periode lalu</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Nilai Pesanan Rata-rata</div>
              <div className="text-3xl font-bold">{formatCurrency(metrics.averageOrderValue)}</div>
              <div className={`flex items-center text-xs ${
                previousPeriodComparison.aov.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {previousPeriodComparison.aov.isPositive ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )}
                <span>{Math.abs(previousPeriodComparison.aov.value).toFixed(1)}% dari periode lalu</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Tingkat Konversi</div>
              <div className="text-3xl font-bold">{metrics.conversionRate}%</div>
              <div className={`flex items-center text-xs ${
                previousPeriodComparison.conversion.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {previousPeriodComparison.conversion.isPositive ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )}
                <span>{Math.abs(previousPeriodComparison.conversion.value).toFixed(1)}% dari periode lalu</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
