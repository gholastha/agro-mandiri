'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/api/hooks/useProducts';
import { useOrders } from '@/api/hooks/useOrders';
import { formatCurrency } from '@/lib/utils';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  DollarSign
} from 'lucide-react';

const orderStatusLabels = {
  pending: 'Tertunda',
  delivered: 'Dikirim',
  canceled: 'Dibatalkan'
};

export default function AdminDashboard() {
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  // Only fetch orders when we're on the dashboard page
  const { data: orders, isLoading: isLoadingOrders } = useOrders({ 
    limit: 5,
    enabled: true // Explicitly enable orders fetching on dashboard
  });
  
  // Calculate dashboard metrics
  const totalProducts = products?.length || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      
      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Produk
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingProducts ? (
              <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
            ) : (
              <div className="text-2xl font-bold">{totalProducts}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pesanan
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
              <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
            ) : (
              <div className="text-2xl font-bold">{totalOrders}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pesanan Tertunda
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
              <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
            ) : (
              <div className="text-2xl font-bold">{pendingOrders}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pendapatan
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
              <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Pesanan Terbaru</CardTitle>
          <CardDescription>
            {totalOrders} pesanan ditemukan dalam bulan ini
          </CardDescription>
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
          ) : orders && orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
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
                    <Badge
                      className={`${order.status === 'canceled' 
                        ? 'bg-red-500' 
                        : order.status === 'delivered' 
                        ? 'bg-green-500' 
                        : 'bg-blue-500'} hover:${order.status === 'canceled' 
                        ? 'bg-red-600' 
                        : order.status === 'delivered' 
                        ? 'bg-green-600' 
                        : 'bg-blue-600'}`}
                    >
                      {orderStatusLabels[order.status]}
                    </Badge>
                    <p className="font-medium">
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Belum Ada Pesanan</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Pesanan pelanggan akan muncul di sini ketika ada pembelian baru.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
