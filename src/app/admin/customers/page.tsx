'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomers } from '@/api/hooks/useCustomers';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Customer, CustomerStatus } from '@/api/types/customers';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingCart,
  DollarSign,
  ArrowUpDown,
} from 'lucide-react';

export default function CustomersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { data: customers, isLoading, error } = useCustomers({
    search: searchQuery.length > 2 ? searchQuery : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort customers
  const filteredCustomers = customers
    ? customers.sort((a, b) => {
        let comparison = 0;

        if (sortField === 'name') {
          const nameA = `${a.first_name} ${a.last_name}`;
          const nameB = `${b.first_name} ${b.last_name}`;
          comparison = nameA.localeCompare(nameB);
        } else if (sortField === 'email') {
          comparison = a.email.localeCompare(b.email);
        } else if (sortField === 'orders') {
          comparison = (a.orders_count || 0) - (b.orders_count || 0);
        } else if (sortField === 'spent') {
          comparison = (a.total_spent || 0) - (b.total_spent || 0);
        }

        return sortDirection === 'desc' ? comparison * -1 : comparison;
      })
    : [];
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle errors
  if (error) {
    toast.error('Gagal memuat data pelanggan. Silakan coba lagi.');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Pelanggan</h1>
        <Button variant="outline" onClick={() => router.push('/admin')}>
          Kembali ke Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pelanggan</CardTitle>
          <CardDescription>
            Lihat dan kelola informasi pelanggan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari nama, email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value={CustomerStatus.Active}>Aktif</SelectItem>
                  <SelectItem value={CustomerStatus.Inactive}>Tidak Aktif</SelectItem>
                  <SelectItem value={CustomerStatus.Blocked}>Diblokir</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Nama</span>
                        {sortField === 'name' && (
                          <ArrowUpDown className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180 transform' : ''}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                        {sortField === 'email' && (
                          <ArrowUpDown className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180 transform' : ''}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>Telepon</span>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Bergabung</span>
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer text-center"
                      onClick={() => handleSort('orders')}
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Pesanan</span>
                        {sortField === 'orders' && (
                          <ArrowUpDown className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180 transform' : ''}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer text-right"
                      onClick={() => handleSort('spent')}
                    >
                      <div className="flex items-center justify-end space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>Total Belanja</span>
                        {sortField === 'spent' && (
                          <ArrowUpDown className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180 transform' : ''}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Tidak ada pelanggan yang ditemukan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="font-medium">
                            {customer.first_name} {customer.last_name}
                          </div>
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone || '-'}</TableCell>
                        <TableCell>{formatDate(customer.created_at)}</TableCell>
                        <TableCell className="text-center">{customer.orders_count || 0}</TableCell>
                        <TableCell className="text-right">{formatCurrency(customer.total_spent || 0)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/customers/${customer.id}`)}
                          >
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan {filteredCustomers.length} dari {customers?.length || 0} pelanggan
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
