import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { History, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

interface EventLogProps {
  logs: LogEntry[];
}

export const EventLog: React.FC<EventLogProps> = ({ logs }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 border-b">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <History className="h-4 w-4" /> Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-[300px]">
          <div className="divide-y">
            {logs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-xs italic">
                No recent activity recorded.
              </div>
            ) : (
              logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="p-3 flex items-start gap-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="mt-0.5">
                    {log.type === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {log.type === 'warning' && <AlertCircle className="h-4 w-4 text-amber-500" />}
                    {log.type === 'info' && <Info className="h-4 w-4 text-blue-500" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-xs leading-relaxed">{log.message}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{log.timestamp}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
