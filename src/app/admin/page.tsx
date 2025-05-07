'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useProducts } from '@/api/hooks/useProducts';
import { useOrders } from '@/api/hooks/useOrders';
import { formatCurrency } from '@/lib/utils';
import { OrderStatus } from '@/api/types/orders';
import { 
  Package, 
  ShoppingCart, 
  Calendar,
  DollarSign
} from 'lucide-react';

// Real-time data hook
import { useRealTimeData } from '@/hooks/useRealTimeData';

// Import our new components
import { MetricCard } from '@/components/dashboard/metric-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ErrorState } from '@/components/ui/error-states';
import { SalesTrendChart } from '@/components/dashboard/sales-trend-chart';
import { DateFilter } from '@/components/dashboard/date-filter';
import { ExportData } from '@/components/dashboard/export-data';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { TopProducts } from '@/components/dashboard/top-products';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageBreadcrumbs } from '@/components/admin/layout/breadcrumbs';
import { AlertBanner } from '@/components/admin/alert-banner';
import { useAlerts } from '@/hooks/useAlerts';

export default function AdminDashboard() {
  // Alert system
  const { alerts, dismissAlert } = useAlerts();
  
  // Date range state
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  // Products data
  const { 
    data: products, 
    isLoading: isLoadingProducts
  } = useProducts();
  
  // Orders data with date filtering
  const { 
    data: orders, 
    isLoading: isLoadingOrders, 
    error: ordersError,
    refetch: refetchOrders
  } = useOrders({ 
    limit: 10,
    enabled: true
  });
  
  // Set up real-time updates
  const handleDataUpdate = useCallback(() => {
    // Refresh data when changes occur
    refetchOrders();
  }, [refetchOrders]);
  
  // Subscribe to real-time updates for orders
  useRealTimeData({
    table: 'orders',
    onAny: handleDataUpdate
  });
  
  // Filter options for order status
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  
  // Filter orders based on status and date range
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    return orders.filter(order => {
      const orderDate = new Date(order.created_at);
      const isInDateRange = orderDate >= dateRange.from && orderDate <= dateRange.to;
      
      if (!isInDateRange) return false;
      if (statusFilter === 'all') return true;
      return order.status === statusFilter;
    });
  }, [orders, statusFilter, dateRange]);
  
  // Calculate dashboard metrics
  const totalProducts = products?.length || 0;
  const totalOrders = filteredOrders?.length || 0;
  const pendingOrders = filteredOrders?.filter(order => order.status === 'pending').length || 0;
  const totalRevenue = filteredOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Calculate product performance metrics
  const productPerformance = useMemo(() => {
    if (!orders || orders.length === 0 || !products || products.length === 0) return [];
    
    // This is a simplification - in a real application, you would
    // fetch order items with product details from your database
    return products.map(product => ({
      id: product.id,
      name: product.name,
      sold: Math.floor(Math.random() * 50) + 1, // Placeholder for demo
      revenue: (Math.floor(Math.random() * 50) + 1) * product.price,
      stock_quantity: product.stock_quantity || 0
    }));
  }, [orders, products]);
  
  // We can use this for future improvements to show order breakdown by status
  // const ordersByStatus = useMemo(() => {
  //   if (!filteredOrders || filteredOrders.length === 0) return {};
  //   
  //   return filteredOrders.reduce((acc, order) => {
  //     if (!acc[order.status]) {
  //       acc[order.status] = 0;
  //     }
  //     acc[order.status]++;
  //     return acc;
  //   }, {} as Record<string, number>);
  // }, [filteredOrders]);
  
  // Handle date range change from DateFilter component
  const handleDateChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
  };
  
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <PageBreadcrumbs />
      
      {/* Alert Banner */}
      <AlertBanner 
        alerts={alerts} 
        onDismiss={dismissAlert} 
        className="mb-4"
      />
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <DateFilter onDateChange={handleDateChange} />
          <ExportData 
            data={filteredOrders} 
            filename="agro-mandiri-orders"
            isLoading={isLoadingOrders} 
          />
        </div>
      </div>
      
      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Produk"
          value={totalProducts}
          icon={<Package className="h-4 w-4" />}
          isLoading={isLoadingProducts}
          trend={{ value: 5, isPositive: true }}
        />
        
        <MetricCard
          title="Total Pesanan"
          value={totalOrders}
          icon={<ShoppingCart className="h-4 w-4" />}
          isLoading={isLoadingOrders}
          trend={{ value: 12, isPositive: true }}
        />
        
        <MetricCard
          title="Pesanan Tertunda"
          value={pendingOrders}
          icon={<Package className="h-4 w-4" />}
          isLoading={isLoadingOrders}
        />
        
        <MetricCard
          title="Total Pendapatan"
          value={totalRevenue}
          formatter={formatCurrency}
          icon={<DollarSign className="h-4 w-4" />}
          isLoading={isLoadingOrders}
          trend={{ value: 8, isPositive: true }}
        />
      </div>
      
      {/* Dashboard Overview */}
      <DashboardOverview
        metrics={{
          totalRevenue,
          totalOrders,
          averageOrderValue,
          conversionRate: 5.7 // Placeholder value
        }}
        previousPeriodComparison={{
          revenue: { value: 12.5, isPositive: true },
          orders: { value: 8.3, isPositive: true },
          aov: { value: 4.2, isPositive: true },
          conversion: { value: 1.8, isPositive: true }
        }}
        isLoading={isLoadingOrders}
      />
      
      {/* Sales Chart */}
      <SalesTrendChart 
        data={orders || []} 
        isLoading={isLoadingOrders} 
      />
      
      {/* Product Performance Charts */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <TopProducts 
          products={productPerformance} 
          isLoading={isLoadingOrders || isLoadingProducts} 
          type="sold"
        />
        
        <TopProducts 
          products={productPerformance} 
          isLoading={isLoadingOrders || isLoadingProducts} 
          type="revenue"
        />
      </div>
      
      {/* Orders Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Pesanan Terbaru</CardTitle>
              <CardDescription>
                {totalOrders} pesanan dalam periode {format(dateRange.from)} - {format(dateRange.to)}
              </CardDescription>
            </div>
            
            <Tabs 
              defaultValue="all" 
              className="mt-4 md:mt-0" 
              onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}
            >
              <TabsList>
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="pending">Tertunda</TabsTrigger>
                <TabsTrigger value="processing">Diproses</TabsTrigger>
                <TabsTrigger value="delivered">Terkirim</TabsTrigger>
                <TabsTrigger value="canceled">Dibatalkan</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingOrders ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-12 w-12 animate-pulse rounded-md bg-muted" />
                  <div className="space-y-2">
                    <div className="h-4 w-[250px] animate-pulse rounded-md bg-muted" />
                    <div className="h-4 w-[200px] animate-pulse rounded-md bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : ordersError ? (
            <ErrorState 
              type="general"
              onRetry={() => refetchOrders()}
            />
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="space-y-1">
                      <p className="font-medium">Pesanan #{order.id.substring(0, 8)}</p>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={order.status} type="order" />
                    <p className="font-medium">
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ErrorState 
              type="empty"
              title="Belum Ada Pesanan"
              message="Pesanan pelanggan akan muncul di sini ketika ada pembelian baru."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to format dates
function format(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
