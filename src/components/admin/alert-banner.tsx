'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, AlertTriangle, Bell, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export type AlertType = 'warning' | 'info' | 'error';

export interface AlertInfo {
  id: string;
  type: AlertType;
  message: string;
  link?: {
    href: string;
    label: string;
  };
}

interface AlertBannerProps {
  alerts: AlertInfo[];
  onDismiss?: (alertId: string) => void;
  className?: string;
}

export function AlertBanner({ alerts, onDismiss, className }: AlertBannerProps) {
  if (alerts.length === 0) return null;
  
  const getIcon = (type: AlertType) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  const getVariant = (type: AlertType) => {
    switch (type) {
      case 'warning':
        return 'border-orange-200 bg-orange-50 text-orange-800 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-300';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300';
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {alerts.map((alert) => (
        <Alert 
          key={alert.id}
          className={cn(
            "flex items-center justify-between pr-4", 
            getVariant(alert.type)
          )}
          role="alert"
        >
          <div className="flex items-center space-x-2">
            {getIcon(alert.type)}
            <AlertDescription className="text-sm font-medium">
              {alert.message}
            </AlertDescription>
          </div>
          
          <div className="flex items-center gap-2">
            {alert.link && (
              <Link 
                href={alert.link.href}
                className="text-xs font-medium flex items-center hover:underline"
              >
                {alert.link.label}
                <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            )}
            
            {onDismiss && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full opacity-70 hover:opacity-100"
                onClick={() => onDismiss(alert.id)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Dismiss</span>
              </Button>
            )}
          </div>
        </Alert>
      ))}
    </div>
  );
}
