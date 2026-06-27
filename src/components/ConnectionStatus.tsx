import React from 'react';
import { Bluetooth, Globe, Signal, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ConnectionStatusProps {
  mode: 'bluetooth' | 'internet';
  strength: number; // 0-100
  latency: number; // ms
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ mode, strength, latency }) => {
  const isBT = mode === 'bluetooth';

  return (
    <Card className={`overflow-hidden border-2 transition-all duration-500 ease-in-out ${
      isBT 
        ? 'border-blue-400/50 dark:border-blue-500/30 shadow-blue-100 dark:shadow-blue-900/10' 
        : 'border-purple-400/50 dark:border-purple-500/30 shadow-purple-100 dark:shadow-purple-900/10'
    } shadow-md`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Connection Health</CardTitle>
        <Badge variant={isBT ? "default" : "secondary"} className="animate-pulse transition-colors duration-500">
          {isBT ? 'Local (Bluetooth)' : 'Cloud (Internet)'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 py-4">
          <div className={`p-3 rounded-full transition-colors duration-500 ${isBT ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {isBT ? <Bluetooth className="h-8 w-8" /> : <Globe className="h-8 w-8" />}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Signal className="h-3 w-3" /> Signal Strength
              </span>
              <span className="font-mono font-bold">{strength}%</span>
            </div>
            <Progress value={strength} className={`h-2 ${isBT ? '[&>div]:bg-blue-500' : '[&>div]:bg-purple-500'}`} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2 border-t text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground uppercase tracking-wider">Latency</span>
            <span className="font-semibold flex items-center gap-1">
              <Zap className="h-3 w-3 text-yellow-500" /> {latency}ms
            </span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-muted-foreground uppercase tracking-wider">Protocol</span>
            <span className="font-semibold">{isBT ? 'BLE 5.2' : 'MQTT/TLS'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
