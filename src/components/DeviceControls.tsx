import React from 'react';
import { Power, Lightbulb, Thermometer, ShieldCheck, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export const DeviceControls: React.FC = () => {
  const [isOn, setIsOn] = React.useState(true);
  const [intensity, setIntensity] = React.useState(75);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-green-500" /> Smart Hub Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-md ${isOn ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
              <Power className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">System Power</p>
              <p className="text-xs text-muted-foreground">{isOn ? 'Online' : 'Offline'}</p>
            </div>
          </div>
          <Switch checked={isOn} onCheckedChange={setIsOn} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" /> LED Intensity
            </Label>
            <span className="text-sm font-mono">{intensity}%</span>
          </div>
          <Slider 
            value={[intensity]} 
            onValueChange={(v) => setIntensity(v[0])} 
            max={100} 
            disabled={!isOn}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="w-full justify-start gap-2 h-12" disabled={!isOn}>
            <Thermometer className="h-4 w-4" /> Eco Mode
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2 h-12" disabled={!isOn}>
            <Zap className="h-4 w-4" /> Turbo Sync
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
