import { useEffect } from 'react';
import { supabase } from '@/api/supabase/client';

type RealtimeOptions = {
  table: string;
  onInsert?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
  onAny?: () => void;
};

/**
 * Hook to subscribe to real-time changes in Supabase tables
 */
export function useRealTimeData({
  table,
  onInsert,
  onUpdate,
  onDelete,
  onAny
}: RealtimeOptions) {
  useEffect(() => {
    // Set up real-time subscription
    const channel = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table 
        }, 
        () => {
          if (onInsert) onInsert();
          if (onAny) onAny();
        }
      )
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table 
        }, 
        () => {
          if (onUpdate) onUpdate();
          if (onAny) onAny();
        }
      )
      .on('postgres_changes', 
        { 
          event: 'DELETE', 
          schema: 'public', 
          table 
        }, 
        () => {
          if (onDelete) onDelete();
          if (onAny) onAny();
        }
      )
      .subscribe();

    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, onInsert, onUpdate, onDelete, onAny]);
}
