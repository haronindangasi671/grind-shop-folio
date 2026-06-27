# Implementation Plan - Hybrid Bluetooth/Internet App Concept

This plan outlines the creation of a frontend-focused application concept that simulates a hybrid connection strategy. Since browsers cannot directly control low-level Bluetooth hardware for "far" distances without specific Web Bluetooth API limitations (proximity based), this app will serve as a functional UI/UX prototype demonstrating how such a system would work.

## Scope Summary
- **Primary Goal:** Build a dashboard that monitors "Connection Health" and switches between "Bluetooth" (close range) and "Cloud/Internet" (far range) modes.
- **Key Features:**
    - Connectivity Status Indicator (Simulated).
    - Proximity/Distance Slider to trigger logic between Bluetooth and Internet modes.
    - Simulated Data Stream (heartbeat/sensor data) that persists across mode switches.
    - Connection History log.
    - Mock "Device Search" for Bluetooth pairing.
- **Non-Goals:**
    - Actual low-level OS Bluetooth driver interaction (Web Bluetooth API is limited and hardware-dependent).
    - Real-time backend sync (will use LocalStorage/State for persistence).

## Assumptions & Open Questions
- **Assumption:** The user wants a conceptual/functional UI that *demonstrates* the logic of switching between these two modes based on distance.
- **Question:** Is there a specific device being controlled (e.g., a smart light, a tracker)? *Decision: I will use a generic "Smart Device Controller" theme.*

## Affected Areas
- **Frontend UI:** New dashboard layout, connection status components, and control panels.
- **State Management:** Logic to handle "distance" thresholds and toggle connection modes.
- **Mock Services:** Simulated Bluetooth discovery and Cloud syncing indicators.

## Phases

### Phase 1: Core Layout & Navigation
- Set up a modern, mobile-responsive dashboard layout.
- Create the main "Device Status" card.
- **Owner:** `frontend_engineer`

### Phase 2: Connection Logic & Distance Simulation
- Implement a "Distance Simulator" (range input) that affects the "active" connection type.
- Add logic: 0-10m = Bluetooth Preferred; >10m = Cloud/Internet Preferred.
- Create visual indicators for "Signal Strength" (RSSI for Bluetooth, Latency for Cloud).
- **Owner:** `frontend_engineer`

### Phase 3: Interactive Controls & Data Log
- Build a "Device Control" panel (e.g., Toggle Power, Adjust Intensity).
- Implement a "Live Data Stream" visualization (simple line chart or scrolling log).
- Add a "Connection Event Log" to show when handoffs happen.
- **Owner:** `frontend_engineer`

### Phase 4: Refinement & Polishing
- Add animations for "handing off" between Bluetooth and Internet.
- Ensure dark mode compatibility and high-fidelity UI using Shadcn components.
- **Owner:** `quick_fix_engineer`

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Build the core dashboard and simulated connectivity logic.
2. quick_fix_engineer — Polish UI, add transitions, and ensure design consistency.

**Per-agent instructions:**

### 1. frontend_engineer
- **Phases:** 1, 2, 3
- **Scope:** Create a "Hybrid Connectivity Dashboard". Use `src/App.tsx` and create components in `src/components/`.
- **Logic:** 
    - Create a state variable `distance`.
    - Derive `connectionMode` (Bluetooth if distance < 10, else Internet).
    - Use `Lucide` icons for Bluetooth/Wifi status.
    - Implement a "Scanning" state for Bluetooth pairing.
- **Files:** `src/App.tsx`, `src/components/ConnectionStatus.tsx`, `src/components/DeviceControls.tsx`, `src/components/DistanceSlider.tsx`
- **Depends on:** none
- **Acceptance criteria:** App shows a clear switch between "Bluetooth" and "Internet" modes as the slider moves. UI updates real-time.

### 2. quick_fix_engineer
- **Phases:** 4
- **Scope:** Refine CSS, add Framer Motion (if available) or standard CSS transitions for mode switching. Fix any alignment issues in the dashboard layout.
- **Files:** `src/index.css`, `src/App.tsx`
- **Depends on:** frontend_engineer
- **Acceptance criteria:** Smooth visual transition when connection mode changes. No layout shifts on mobile.

**Do not dispatch:** supabase_engineer
