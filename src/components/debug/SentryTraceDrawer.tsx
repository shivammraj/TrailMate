'use client';

import React, { useState } from 'react';
import { Activity, X, Terminal, Clock, Zap, CheckCircle2 } from 'lucide-react';

export default function SentryTraceDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const mockTraces = [
    {
      id: 'trace-weather-01',
      span: 'GET https://api.weatherapi.com/v1/current.json',
      durationMs: 142,
      status: '200 OK',
      timestamp: '2026-10-10 20:45:12'
    },
    {
      id: 'trace-tabpfn-02',
      span: 'TabPFN.predict(humidity=55, temp=20, precip=10)',
      durationMs: 88,
      status: 'Inference Complete',
      timestamp: '2026-10-10 20:45:15'
    },
    {
      id: 'trace-gemma-03',
      span: 'Gemma2.generate_response(prompt="Gear list for wet hike")',
      durationMs: 310,
      status: '200 OK (214 tokens)',
      timestamp: '2026-10-10 20:45:22'
    },
    {
      id: 'trace-elevenlabs-04',
      span: 'ElevenLabs.synthesize(text="Trail Audio Tour")',
      durationMs: 195,
      status: 'Audio Buffer Rendered',
      timestamp: '2026-10-10 20:45:28'
    }
  ];

  return (
    <>
      {/* Floating Trigger Pill */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 px-3 py-2 rounded-full glass-card border border-emerald-500/40 text-stone-200 hover:text-white hover:border-emerald-400 text-xs font-mono flex items-center gap-2 shadow-2xl transition-all hover:scale-105"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <Activity className="w-3.5 h-3.5 text-emerald-400" />
        <span>Sentry AI Traces</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0e1610] border-l border-white/10 p-6 flex flex-col h-full shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-outfit font-bold text-white text-base">Sentry Agent Telemetry</h3>
                  <p className="text-[11px] text-stone-400 font-mono">Live Agent Latency & API Traces</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Performance Overview Badges */}
            <div className="grid grid-cols-3 gap-2 my-4">
              <div className="p-2.5 rounded-xl bg-stone-900/80 border border-white/5 text-center">
                <span className="text-[10px] text-stone-400 font-mono uppercase block">Avg Latency</span>
                <span className="text-sm font-bold font-mono text-emerald-400">183 ms</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-900/80 border border-white/5 text-center">
                <span className="text-[10px] text-stone-400 font-mono uppercase block">API Health</span>
                <span className="text-sm font-bold font-mono text-emerald-400">100%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-900/80 border border-white/5 text-center">
                <span className="text-[10px] text-stone-400 font-mono uppercase block">Error Rate</span>
                <span className="text-sm font-bold font-mono text-emerald-400">0.0%</span>
              </div>
            </div>

            {/* Traces List */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              <div className="text-xs font-semibold text-stone-300 font-mono uppercase tracking-wider">Executed Spans</div>
              {mockTraces.map((trace) => (
                <div key={trace.id} className="p-3 rounded-xl bg-stone-900/90 border border-white/10 space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-emerald-400 font-semibold text-[11px]">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {trace.status}
                    </span>
                    <span className="text-stone-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {trace.durationMs}ms
                    </span>
                  </div>
                  <div className="text-stone-200 text-xs font-sans break-all">{trace.span}</div>
                  <div className="text-[9px] text-stone-500">{trace.timestamp}</div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 text-[10px] font-mono text-stone-500 text-center">
              Powered by Sentry Agent Tracing SDK v2.4
            </div>
          </div>
        </div>
      )}
    </>
  );
}
