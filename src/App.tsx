import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectionStatus } from './components/ConnectionStatus';
import { DistanceSlider } from './components/DistanceSlider';
import { DeviceControls } from './components/DeviceControls';
import { LiveChart } from './components/LiveChart';
import { EventLog, LogEntry } from './components/EventLog';
import { Toaster, toast } from 'sonner';
import { 
  Bluetooth, 
  Settings, 
  LayoutDashboard, 
  Search, 
  Loader2,
  RefreshCcw,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

function App() {
  const [distance, setDistance] = useState(2.5);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [chartData, setChartData] = useState<{ time: string; value: number }[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [isPaired, setIsPaired] = useState(false);
  const [isHandingOff, setIsHandingOff] = useState(false);

  // Derived state
  const mode = distance <= 10 ? 'bluetooth' : 'internet';
  
  const strength = useMemo(() => {
    if (mode === 'bluetooth') {
      // Bluetooth strength drops as distance increases towards 10m
      return Math.max(20, Math.round(100 - (distance * 8)));
    } else {
      // Internet strength is fairly stable but lower quality simulation
      return 85 + Math.floor(Math.random() * 10);
    }
  }, [distance, mode]);

  const latency = useMemo(() => {
    if (mode === 'bluetooth') {
      return 15 + Math.round(distance * 2);
    } else {
      return 120 + Math.floor(Math.random() * 40);
    }
  }, [distance, mode]);

  // Add a log entry
  const addLog = useCallback((message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  // Monitor mode handoffs
  const prevModeRef = React.useRef(mode);
  useEffect(() => {
    if (prevModeRef.current !== mode) {
      // Trigger handoff flash animation
      setIsHandingOff(true);
      setTimeout(() => setIsHandingOff(false), 600);

      if (mode === 'internet') {
        addLog('Bluetooth signal lost. Handing off to Cloud Infrastructure.', 'warning');
        toast.info('Switched to Internet Connection');
      } else {
        addLog('Low-latency Bluetooth device detected. Switching to Local Peer connection.', 'success');
        toast.success('Switched to Bluetooth Connection');
      }
      prevModeRef.current = mode;
    }
  }, [mode, addLog]);

  // Simulate live data
  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = 40 + Math.random() * 40;
      setChartData(prev => {
        const newData = [...prev, { time: new Date().toLocaleTimeString(), value: newValue }];
        return newData.slice(-20);
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Initial logs
  useEffect(() => {
    addLog('System initialized. Waiting for device pairing...', 'info');
  }, [addLog]);

  const startScan = () => {
    setIsScanning(true);
    addLog('Searching for nearby Bluetooth devices...', 'info');
    setTimeout(() => {
      setIsScanning(false);
      setIsPaired(true);
      setShowScanner(false);
      addLog('Successfully paired with SmartHub-v2 via BLE.', 'success');
      toast.success('Device Paired Successfully');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      <Toaster position="top-right" />
      
      {/* Navigation Header */}
      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-10 px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="font-bold text-xl tracking-tight hidden sm:block">HybridLink</h1>
        </div>

        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
            <Settings className="h-4 w-4" /> Settings
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          {!isPaired ? (
            <Button size="sm" onClick={() => setShowScanner(true)} className="gap-2">
              <Search className="h-4 w-4" /> Pair Device
            </Button>
          ) : (
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 px-3 py-1 gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Paired
            </Badge>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8">
        {/* Handoff Flash Overlay */}
        <AnimatePresence>
          {isHandingOff && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`fixed inset-0 z-50 pointer-events-none ${
                mode === 'bluetooth' 
                  ? 'bg-blue-400/10 dark:bg-blue-500/10' 
                  : 'bg-purple-400/10 dark:bg-purple-500/10'
              }`}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
        {!isPaired ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <Bluetooth className="h-24 w-24 text-primary relative" />
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight">Connect to your device</h2>
              <p className="text-muted-foreground">HybridLink automatically switches between Bluetooth and Internet to keep you connected everywhere.</p>
            </div>
            <Button size="lg" onClick={() => setShowScanner(true)} className="px-12 h-14 text-lg shadow-xl shadow-primary/25 rounded-full">
              Get Started
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Column: Connection & Simulation */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ConnectionStatus 
                  mode={mode} 
                  strength={strength} 
                  latency={latency} 
                />
                <LiveChart 
                  data={chartData} 
                  color={mode === 'bluetooth' ? '#3b82f6' : '#a855f7'} 
                />
              </div>
              
              <DistanceSlider 
                value={distance} 
                onChange={setDistance} 
              />
              
              <div className="bg-card border rounded-xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <RefreshCcw className="h-12 w-12 animate-spin-slow" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Hybrid Logic Insights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Active Gateway</p>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={mode}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                          className="font-mono text-sm"
                        >
                          {mode === 'bluetooth' ? 'Local-P2P' : 'AWS-Region-East'}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Handover Status</p>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={isHandingOff ? 'handing-off' : 'ready'}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className={`font-mono text-sm ${isHandingOff ? 'text-amber-500' : 'text-green-600 dark:text-green-400'}`}
                        >
                          {isHandingOff ? '⟳ Handing off...' : '✓ Ready (0.2s)'}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Encrypted Tunnel</p>
                      <p className="font-mono text-sm">AES-256-GCM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Controls & Log */}
            <div className="lg:col-span-4 space-y-6">
              <DeviceControls />
              <EventLog logs={logs} />
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 px-8 text-center text-xs text-muted-foreground">
        <p>© 2024 HybridLink Concepts. Built with React 19 & Tailwind CSS.</p>
      </footer>

      {/* Pair Dialog */}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Discover Nearby Devices</DialogTitle>
            <DialogDescription>
              Searching for HybridLink compatible hardware via Web Bluetooth.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            {isScanning ? (
              <>
                <div className="relative">
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin h-16 w-16" />
                  <Bluetooth className="h-8 w-8 text-primary absolute top-4 left-4" />
                </div>
                <p className="text-sm font-medium animate-pulse">Scanning frequencies...</p>
              </>
            ) : (
              <div className="w-full space-y-4">
                <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors border-primary/50 bg-primary/5 flex items-center justify-between group" onClick={startScan}>
                  <div className="flex items-center gap-3">
                    <Bluetooth className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-bold text-sm">SmartHub-v2</p>
                      <p className="text-xs text-muted-foreground">ID: 4C:2B:0F:77:E1</p>
                    </div>
                  </div>
                  <Badge className="group-hover:bg-primary transition-colors">Select</Badge>
                </div>
                <div className="border rounded-lg p-4 opacity-50 cursor-not-allowed flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bluetooth className="h-5 w-5" />
                    <div>
                      <p className="font-bold text-sm">Unknown Device</p>
                      <p className="text-xs text-muted-foreground">Unsupported model</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={() => setShowScanner(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
