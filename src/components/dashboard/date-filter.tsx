import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { subDays } from 'date-fns';

type DateRange = {
  from: Date;
  to: Date;
};

type DateFilterProps = {
  onDateChange: (range: DateRange) => void;
};

export function DateFilter({ onDateChange }: DateFilterProps) {
  const [currentRange, setCurrentRange] = useState('30');
  
  // Define handleRangeSelect before using it in useEffect
  const handleRangeSelect = (days: number) => {
    const to = new Date();
    const from = subDays(to, days);
    const newRange = { from, to };
    
    setCurrentRange(days.toString());
    onDateChange(newRange);
  };
  
  // Update the date range when the component mounts
  // Using empty dependency array since we only want this to run once
  // and handleRangeSelect doesn't depend on any props or state
  useEffect(() => {
    handleRangeSelect(30);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        <Calendar className="mr-2 h-4 w-4" />
        <span className="text-sm font-medium">Filter periode:</span>
      </div>
      <div className="flex space-x-1">
        <Button 
          variant={currentRange === '7' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleRangeSelect(7)}
        >
          7 hari
        </Button>
        <Button 
          variant={currentRange === '30' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleRangeSelect(30)}
        >
          30 hari
        </Button>
        <Button 
          variant={currentRange === '90' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleRangeSelect(90)}
        >
          90 hari
        </Button>
      </div>
    </div>
  );
}
