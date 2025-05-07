'use client';

import { useState, useEffect } from 'react';
import { useProducts } from '@/api/hooks/useProducts';
import { useOrders } from '@/api/hooks/useOrders';
import { AlertInfo } from '@/components/admin/alert-banner';
import { v4 as uuidv4 } from 'uuid';

// Configurable thresholds
const LOW_STOCK_THRESHOLD = 5; // Products with stock below this are considered low
const PENDING_ORDERS_THRESHOLD = 3; // Alert if more than this many pending orders

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertInfo[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  
  // Get data from API
  const { data: products } = useProducts();
  const { data: orders } = useOrders({ status: 'pending' });
  
  useEffect(() => {
    const newAlerts: AlertInfo[] = [];
    
    // Check for low stock products
    if (products && products.length > 0) {
      const lowStockProducts = products.filter(p => 
        p.is_active && p.stock_quantity <= LOW_STOCK_THRESHOLD
      );
      
      if (lowStockProducts.length > 0) {
        newAlerts.push({
          id: 'low-stock-' + uuidv4().slice(0, 8),
          type: 'warning',
          message: `${lowStockProducts.length} produk hampir habis stok`,
          link: {
            href: '/admin/products?filter=low-stock',
            label: 'Lihat produk'
          }
        });
      }
    }
    
    // Check for pending orders
    if (orders && orders.length >= PENDING_ORDERS_THRESHOLD) {
      newAlerts.push({
        id: 'pending-orders-' + uuidv4().slice(0, 8),
        type: 'info',
        message: `${orders.length} pesanan menunggu diproses`,
        link: {
          href: '/admin/orders?status=pending',
          label: 'Kelola pesanan'
        }
      });
    }
    
    // Filter out dismissed alerts
    const filteredAlerts = newAlerts.filter(alert => 
      !dismissedAlerts.includes(alert.id)
    );
    
    setAlerts(filteredAlerts);
  }, [products, orders, dismissedAlerts]);
  
  // Function to dismiss an alert
  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };
  
  return { 
    alerts,
    dismissAlert
  };
}
