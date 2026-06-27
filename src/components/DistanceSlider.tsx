import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

interface DistanceSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const DistanceSlider: React.FC<DistanceSliderProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-6 p-6 bg-secondary/30 rounded-xl border border-border">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-lg font-bold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Distance Simulator
          </Label>
          <p className="text-sm text-muted-foreground">Adjust your distance from the device to trigger handoffs.</p>
        </div>
        <div className={`text-2xl font-mono font-bold tabular-nums transition-colors duration-500 ${
          value <= 10 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-purple-600 dark:text-purple-400'
        }`}>
          {value}m
        </div>
      </div>
      
      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        max={100}
        step={0.5}
        className="cursor-pointer"
      />
      
      <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground px-1">
        <span>Near (Bluetooth)</span>
        <div className="flex items-center gap-1">
          <div className="w-px h-2 bg-border" />
          <span>10m Handoff</span>
          <div className="w-px h-2 bg-border" />
        </div>
        <span>Far (Internet)</span>
      </div>
    </div>
  );
};
