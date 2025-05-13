'use client';
import { LayoutGrid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { useProductPreferences, ViewMode } from '@/store/product-preferences';

interface ProductViewSwitchProps {
  /** Current view mode value */
  value?: ViewMode;
  /** Optional callback when view mode changes */
  onChange?: (mode: ViewMode) => void;
}

export function ProductViewSwitch({ value, onChange }: ProductViewSwitchProps) {
  // Use our Zustand store for persisting user preference
  const { viewMode, setViewMode } = useProductPreferences();
  
  // Determine which view mode to display - prop value takes precedence over store
  const displayMode = value !== undefined ? value : viewMode;
  
  // Handle view mode change
  const handleViewModeChange = (newMode: ViewMode) => {
    if (!newMode) return; // Skip empty values
    
    // Update the store
    setViewMode(newMode);
    
    // Call the optional callback if provided
    if (onChange) {
      onChange(newMode);
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="view-mode" className="text-sm">Tampilan:</Label>
      <ToggleGroup 
        type="single" 
        value={displayMode} 
        onValueChange={(value) => value && handleViewModeChange(value as ViewMode)}
      >
        <ToggleGroupItem value="grid" aria-label="Grid View">
          <LayoutGrid className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List View">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
