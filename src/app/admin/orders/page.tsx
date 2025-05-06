'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrders } from '@/api/hooks/useOrders';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  orderStatusLabels, 
  paymentStatusLabels, 
  orderStatusColors, 
  paymentStatusColors,
  OrderStatus 
} from '@/api/types/orders';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Search,
  Filter,
  Eye,
  Loader2,
  Calendar,
  ArrowUpDown,
  ShoppingCart,
  User,
} from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  
  const { data: orders, isLoading, error } = useOrders({ enabled: true });

  // Filter orders based on search query and status filter
  const filteredOrders = orders
    ? orders.filter((order) => {
        const matchesSearch = searchQuery
          ? order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.customer?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
          : true;

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleViewOrder = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Pesanan</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pesanan</CardTitle>
          <CardDescription>
            Kelola semua pesanan pelanggan di sini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari pesanan berdasarkan ID atau pelanggan..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter berdasarkan status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="processing">Diproses</SelectItem>
                  <SelectItem value="shipped">Dikirim</SelectItem>
                  <SelectItem value="delivered">Diterima</SelectItem>
                  <SelectItem value="canceled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex animate-pulse items-center justify-between rounded-md border p-4">
                  <div className="space-y-2">
                    <div className="h-4 w-[250px] rounded-md bg-muted" />
                    <div className="h-4 w-[200px] rounded-md bg-muted" />
                  </div>
                  <div className="h-10 w-[150px] rounded-md bg-muted" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <h3 className="text-lg font-semibold text-destructive">Error saat memuat pesanan</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Terjadi kesalahan saat memuat data pesanan. Silakan coba lagi nanti.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}>
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Muat ulang
              </Button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              {searchQuery || statusFilter !== 'all' ? (
                <>
                  <h3 className="mt-4 text-lg font-semibold">Tidak ada pesanan sesuai filter</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Coba ubah filter pencarian Anda untuk melihat lebih banyak hasil.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                    }}>
                    Hapus filter
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="mt-4 text-lg font-semibold">Belum ada pesanan</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Pesanan pelanggan akan muncul di sini saat pelanggan melakukan pembelian.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col items-start justify-between space-y-2 rounded-md border p-4 sm:flex-row sm:items-center sm:space-y-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">Pesanan #{order.id.substring(0, 8)}</p>
                      <Badge
                        className={`${
                          order.status === 'canceled'
                            ? 'bg-red-500'
                            : order.status === 'delivered'
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        }`}
                      >
                        {orderStatusLabels[order.status]}
                      </Badge>
                    </div>
                    <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(order.created_at)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="mr-1 h-3 w-3" />
                        {order.customer
                          ? `${order.customer.first_name} ${order.customer.last_name}`
                          : 'Pelanggan tidak diketahui'}
                      </div>
                      <div className="font-medium">
                        {formatCurrency(order.total_amount)}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => handleViewOrder(order.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Detail
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        {filteredOrders.length > 0 && (
          <CardFooter>
            <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
              <div>Menampilkan {filteredOrders.length} dari {orders?.length || 0} pesanan</div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
