'use client';

import { LayoutGrid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';

export type ViewMode = 'grid' | 'list';

interface ProductViewSwitchProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ProductViewSwitch({ viewMode, onChange }: ProductViewSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="view-mode" className="text-sm">Tampilan:</Label>
      <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && onChange(value as ViewMode)}>
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
