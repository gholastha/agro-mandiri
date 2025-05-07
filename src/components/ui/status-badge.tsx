import { Badge } from './badge';
import { OrderStatus, PaymentStatus, orderStatusLabels, paymentStatusLabels, orderStatusColors, paymentStatusColors } from '@/api/types/orders';

type StatusBadgeProps = {
  status: OrderStatus | PaymentStatus;
  type: 'order' | 'payment';
};

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const label = type === 'order' 
    ? orderStatusLabels[status as OrderStatus] 
    : paymentStatusLabels[status as PaymentStatus];
  
  const colorClass = type === 'order'
    ? orderStatusColors[status as OrderStatus]
    : paymentStatusColors[status as PaymentStatus];
  
  return (
    <Badge className={`${colorClass} hover:${colorClass.replace('-500', '-600')}`}>
      {label}
    </Badge>
  );
}
