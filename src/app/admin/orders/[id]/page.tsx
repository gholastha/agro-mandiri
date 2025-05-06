'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder, useUpdateOrderStatus, useUpdatePaymentStatus } from '@/api/hooks/useOrders';
import { formatCurrency } from '@/lib/utils';
import { OrderStatus, PaymentStatus, orderStatusLabels, paymentStatusLabels } from '@/api/types/orders';
import { toast } from 'sonner';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Loader2,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Truck,
  CreditCard,
  Package,
} from 'lucide-react';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const orderId = params.id;
  
  const { data: order, isLoading, error } = useOrder(orderId);
  const { mutateAsync: updateOrderStatus, isPending: isUpdatingOrderStatus } = useUpdateOrderStatus();
  const { mutateAsync: updatePaymentStatus, isPending: isUpdatingPaymentStatus } = useUpdatePaymentStatus();

  const [selectedOrderStatus, setSelectedOrderStatus] = useState<OrderStatus | ''>('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus | ''>('');

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleOrderStatusChange = async () => {
    if (!selectedOrderStatus) return;
    
    try {
      await updateOrderStatus({
        orderId,
        status: selectedOrderStatus as OrderStatus,
      });
      setSelectedOrderStatus('');
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handlePaymentStatusChange = async () => {
    if (!selectedPaymentStatus) return;
    
    try {
      await updatePaymentStatus({
        orderId,
        paymentStatus: selectedPaymentStatus as PaymentStatus,
      });
      setSelectedPaymentStatus('');
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Terjadi Kesalahan</h1>
        <p className="text-muted-foreground">
          Gagal memuat data pesanan. Silakan coba lagi nanti.
        </p>
        <Button variant="outline" onClick={() => router.push('/admin/orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar Pesanan
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Pesanan Tidak Ditemukan</h1>
        <p className="text-muted-foreground">
          Pesanan yang Anda cari tidak ditemukan atau telah dihapus.
        </p>
        <Button variant="outline" onClick={() => router.push('/admin/orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar Pesanan
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Pesanan #{order.id.substring(0, 8)}
          </h1>
          <p className="text-muted-foreground">
            <Calendar className="mr-2 inline-block h-4 w-4" />
            {formatDate(order.created_at)}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Status Pesanan</CardTitle>
            <CardDescription>Perbarui status pesanan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status Saat Ini</p>
                  <Badge className={`px-4 py-1 ${order.status === 'canceled' ? 'bg-red-500' : order.status === 'delivered' ? 'bg-green-500' : 'bg-blue-500'} text-white`}>
                    {orderStatusLabels[order.status]}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Terakhir Diperbarui</p>
                  <p className="text-sm">{formatDate(order.updated_at)}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-end space-x-2">
                <div className="flex-1 space-y-1">
                  <p className="text-sm">Perbarui Status</p>
                  <Select
                    value={selectedOrderStatus}
                    onValueChange={(value) => setSelectedOrderStatus(value as OrderStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status baru" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Menunggu</SelectItem>
                      <SelectItem value="processing">Diproses</SelectItem>
                      <SelectItem value="shipped">Dikirim</SelectItem>
                      <SelectItem value="delivered">Diterima</SelectItem>
                      <SelectItem value="canceled">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleOrderStatusChange}
                  disabled={!selectedOrderStatus || isUpdatingOrderStatus}
                >
                  {isUpdatingOrderStatus ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memperbarui...
                    </>
                  ) : (
                    'Perbarui'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Status Pembayaran</CardTitle>
            <CardDescription>Perbarui status pembayaran</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status Saat Ini</p>
                  <Badge className={`px-4 py-1 ${order.payment_status === 'failed' ? 'bg-red-500' : order.payment_status === 'paid' ? 'bg-green-500' : order.payment_status === 'refunded' ? 'bg-purple-500' : 'bg-yellow-500'} text-white`}>
                    {paymentStatusLabels[order.payment_status]}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Metode Pembayaran</p>
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{order.payment_method || 'Tidak tersedia'}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-end space-x-2">
                <div className="flex-1 space-y-1">
                  <p className="text-sm">Perbarui Status Pembayaran</p>
                  <Select
                    value={selectedPaymentStatus}
                    onValueChange={(value) => setSelectedPaymentStatus(value as PaymentStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status baru" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Menunggu Pembayaran</SelectItem>
                      <SelectItem value="paid">Lunas</SelectItem>
                      <SelectItem value="failed">Gagal</SelectItem>
                      <SelectItem value="refunded">Dikembalikan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handlePaymentStatusChange}
                  disabled={!selectedPaymentStatus || isUpdatingPaymentStatus}
                >
                  {isUpdatingPaymentStatus ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memperbarui...
                    </>
                  ) : (
                    'Perbarui'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Pelanggan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nama</p>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <p>
                    {order.customer
                      ? `${order.customer.first_name} ${order.customer.last_name}`
                      : 'Tidak tersedia'}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <p>{order.customer?.email || 'Tidak tersedia'}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Telepon</p>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <p>{order.customer?.phone || 'Tidak tersedia'}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Alamat Pengiriman</p>
                <div className="flex items-start">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-1" />
                  <p className="whitespace-pre-line">{order.shipping_address || 'Tidak tersedia'}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Metode Pengiriman</p>
                <div className="flex items-center">
                  <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                  <p>{order.shipping_method || 'Tidak tersedia'}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Catatan</p>
                <p className="text-sm whitespace-pre-line">{order.notes || 'Tidak ada catatan'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Produk yang Dipesan</CardTitle>
          <CardDescription>
            Detail produk dalam pesanan ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Produk</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                  <TableHead className="text-center">Jumlah</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                          {item.product_image ? (
                            <Image
                              src={item.product_image}
                              alt={item.product_name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Tidak ada produk dalam pesanan ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <div className="w-[300px] space-y-2">
            <div className="flex justify-between text-sm">
              <p>Subtotal</p>
              <p>{formatCurrency(order.total_amount - order.shipping_cost)}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p>Biaya Pengiriman</p>
              <p>{formatCurrency(order.shipping_cost)}</p>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <p>Total</p>
              <p>{formatCurrency(order.total_amount)}</p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
