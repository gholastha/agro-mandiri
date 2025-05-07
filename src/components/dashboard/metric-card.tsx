import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  isLoading?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  formatter?: (value: any) => string;
};

export function MetricCard({ 
  title, 
  value, 
  icon, 
  isLoading = false, 
  trend,
  formatter = (val) => String(val)
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
        ) : (
          <div className="flex flex-col">
            <div className="text-2xl font-bold">{formatter(value)}</div>
            
            {trend && (
              <div className={`flex items-center text-xs ${
                trend.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {trend.isPositive ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )}
                <span>{Math.abs(trend.value)}% dari bulan lalu</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
