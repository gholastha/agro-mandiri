import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Product {
  id: string;
  name: string;
  sold: number;
  revenue: number;
  stock_quantity: number;
}

interface TopProductsProps {
  products: Product[];
  isLoading: boolean;
  type: 'sold' | 'revenue';
}

export function TopProducts({ products, isLoading, type = 'sold' }: TopProductsProps) {
  // Sort products based on the selected type (sold quantity or revenue)
  const sortedProducts = [...products]
    .sort((a, b) => (type === 'sold' ? b.sold - a.sold : b.revenue - a.revenue))
    .slice(0, 5); // Get top 5

  const chartData = sortedProducts.map(product => ({
    name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
    value: type === 'sold' ? product.sold : product.revenue,
  }));

  return (
    <Card className="col-span-full md:col-span-6">
      <CardHeader>
        <CardTitle>
          {type === 'sold' ? 'Produk Terlaris' : 'Produk Pendapatan Tertinggi'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] w-full animate-pulse rounded-md bg-muted" />
        ) : products.length === 0 ? (
          <div className="flex h-[300px] flex-col items-center justify-center space-y-3 text-center">
            <p className="text-sm text-muted-foreground">Belum ada data produk untuk ditampilkan</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis 
                  type="number" 
                  tickFormatter={(value) => 
                    type === 'revenue' ? formatCurrency(value) : value.toString()
                  }
                />
                <YAxis 
                  type="category" 
                  dataKey="name"
                  width={150}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: number) => 
                    type === 'revenue' ? [formatCurrency(value), 'Pendapatan'] : [value, 'Terjual']
                  }
                />
                <Bar 
                  dataKey="value" 
                  fill="#8884d8"
                  barSize={30}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
