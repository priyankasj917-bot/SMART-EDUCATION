import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Leaf, Clock, Upload, Send, FileText } from 'lucide-react';

export default function CampusFlowDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // Trigger opening animation
    const openTimer = setTimeout(() => setIsOpen(true), 100);
    // INTERACTION LOCK: Content fades in and becomes interactive only after 1.2s
    const contentTimer = setTimeout(() => setContentVisible(true), 1300);
    return () => {
      clearTimeout(openTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden">
      
      {/* Main 3D Scene Container */}
      <div className="relative w-full max-w-6xl aspect-[4/3] md:aspect-[21/9]" style={{ perspective: '2500px' }}>
        
        {/* Book Wrapper - shifts to center as book opens to maintain visual balance */}
        <div 
          className="w-full h-full relative transition-transform ease-in-out"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isOpen ? 'translateX(0)' : 'translateX(-25%)',
            transitionDuration: '1200ms'
          }}
        >
          
          {/* RIGHT PAGE: Student Operations Terminal (Static Base) */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-900 rounded-r-2xl border-y border-r border-slate-800 shadow-2xl flex flex-col z-10">
            {/* Inner Spine Shadow */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black/50 to-transparent pointer-events-none z-0"></div>

            {/* Content Container with Interaction Lock */}
            <div className={`relative z-10 h-full p-6 md:p-8 flex flex-col transition-opacity duration-500 delay-100 ${contentVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
                  <span className="w-2 h-6 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>
                  Student Operations
                </h2>
                <p className="text-slate-400 text-sm mt-1 ml-5 font-medium tracking-wide">Zero-Paper Compliance Terminal</p>
              </div>

              <div className="space-y-6 flex-1 pl-4">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest transition-colors group-focus-within:text-cyan-400">Target Parameter</label>
                  <input type="text" placeholder="Enter operation ID or target context..." className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner" />
                </div>
                
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest transition-colors group-hover:text-cyan-400">Digital Event Brochure</label>
                  <div className="w-full border-2 border-dashed border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:border-cyan-400/50 hover:bg-cyan-950/20 hover:text-cyan-400 transition-all cursor-pointer group/upload relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-900/10 opacity-0 group-hover/upload:opacity-100 transition-opacity"></div>
                    <Upload className="w-8 h-8 mb-3 group-hover/upload:-translate-y-1 group-hover/upload:scale-110 transition-all duration-300 relative z-10" />
                    <span className="text-sm font-semibold relative z-10">Deploy Digital Asset</span>
                    <span className="text-xs mt-1 opacity-70 relative z-10 font-medium">Strictly Zero-Paper Verified</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button className="w-full relative overflow-hidden bg-slate-800/50 hover:bg-slate-700/80 border border-slate-800 text-slate-200 py-3 rounded-xl flex items-center justify-center gap-2 transition-all group active:scale-[0.98]">
                    <Clock className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform duration-500" />
                    <span className="font-semibold text-sm">Trigger Time-Slot Token</span>
                    <span className="text-xs text-slate-400 ml-1 font-medium">(Fees Queue Clearer)</span>
                  </button>
                </div>
              </div>

              {/* EnviroShare Badge & Execute */}
              <div className="pt-6 mt-auto border-t border-slate-800 flex flex-col gap-4 pl-4">
                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 flex items-center gap-4 hover:border-emerald-500/30 transition-colors">
                  <div className="relative flex items-center justify-center shrink-0">
                    <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping"></div>
                    <Leaf className="w-5 h-5 text-emerald-400 relative z-10" />
                  </div>
                  <div>
                    <p className="text-slate-300 text-xs font-bold flex items-center gap-2">
                      EnviroShare Carbon Ledger
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </p>
                    <p className="text-emerald-400/90 text-[11px] mt-1 tracking-wide font-medium">
                      This action saves 15g of paper & offsets 4.6g CO₂
                    </p>
                  </div>
                </div>
                
                <button className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transform hover:-translate-y-0.5 active:scale-[0.98]">
                  <Send className="w-4 h-4" />
                  EXECUTE ZERO-PAPER OPERATION
                </button>
              </div>
            </div>
          </div>

          {/* FRONT COVER & LEFT PAGE (Animated) */}
          <div 
            className="absolute top-0 right-0 w-1/2 h-full origin-left ease-in-out z-50"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: isOpen ? 'rotateY(-180deg)' : 'rotateY(0deg)',
              transitionDuration: '1200ms'
            }}
          >
             {/* Front Face (Cover Design) */}
             <div 
               className="absolute inset-0 bg-slate-900 rounded-r-2xl border-y border-r border-slate-800 flex flex-col items-center justify-center shadow-[15px_10px_40px_rgba(0,0,0,0.8)]"
               style={{ 
                 backfaceVisibility: 'hidden', 
                 WebkitBackfaceVisibility: 'hidden' 
               }}
             >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-transparent rounded-r-2xl pointer-events-none"></div>
                {/* Spine styling */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/60 via-slate-800 to-transparent pointer-events-none"></div>
                
                <div className="relative z-20 flex flex-col items-center transform -translate-y-4">
                  <div className="w-24 h-24 mb-8 rounded-3xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 border border-slate-800 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.15)] backdrop-blur-sm">
                    <Leaf className="w-12 h-12 text-emerald-400" />
                  </div>
                  <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-3 tracking-tight">
                    CampusFlow
                  </h1>
                  <p className="text-slate-400 tracking-[0.4em] text-xs font-bold uppercase mt-2">Institutional OS</p>
                </div>
             </div>

             {/* Back Face: Faculty Command Terminal (Left Page) */}
             <div 
                className="absolute inset-0 bg-slate-900 rounded-r-2xl border-y border-r border-slate-800 shadow-[inset_10px_0_20px_rgba(0,0,0,0.4)] flex flex-col"
                style={{ 
                  backfaceVisibility: 'hidden', 
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)' 
                }}
             >
                {/* Inner Spine Shadow */}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black/50 to-transparent pointer-events-none z-0"></div>

                {/* Content Container with Interaction Lock */}
                <div className={`relative z-10 h-full p-6 md:p-8 flex flex-col transition-opacity duration-500 delay-100 ${contentVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
                      <span className="w-2 h-6 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                      Faculty Command
                    </h2>
                    <p className="text-slate-400 text-sm mt-1 ml-5 font-medium tracking-wide">Workload Reduction Hub</p>
                  </div>

                  <div className="flex flex-col gap-6 flex-1 pr-4">
                    {/* Banner */}
                    <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-5 shadow-inner hover:bg-emerald-950/30 transition-colors">
                      <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <Clock className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-emerald-400/80 font-bold text-[10px] uppercase tracking-widest mb-1">Manual Work Hours Saved</h3>
                        <p className="text-3xl font-black text-slate-100 tracking-tight">14.5<span className="text-lg font-bold text-slate-300 ml-1">Hrs</span> <span className="text-xs font-semibold text-slate-500 ml-2 tracking-normal">Reclaimed This Week</span></p>
                      </div>
                    </div>

                    {/* SmartOD & Leave Approval Stack */}
                    <div className="flex-1 flex flex-col gap-3 min-h-0">
                      <h3 className="text-slate-300 font-bold text-[11px] uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-cyan-400" />
                        SmartOD Action Stack
                      </h3>
                      <div className="bg-slate-950/50 rounded-2xl border border-slate-800 p-5 space-y-4 hover:border-slate-700/80 transition-all shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded uppercase tracking-wider">ID: 883-A9</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.5)]"></span>
                            </div>
                            <p className="text-slate-200 font-semibold text-sm">Tech Symposium 2026</p>
                            <p className="text-slate-500 text-xs mt-1 font-medium">Duration: 3 Academic Days</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500/20 border border-emerald-500/20 transition-all hover:scale-105 active:scale-95 group">
                              <CheckCircle className="w-4 h-4 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.4)] rounded-full transition-shadow" />
                            </button>
                            <button className="p-3 bg-rose-500/10 text-rose-400 rounded-xl hover:bg-rose-500/20 border border-rose-500/20 transition-all hover:scale-105 active:scale-95 group">
                              <XCircle className="w-4 h-4 group-hover:shadow-[0_0_10px_rgba(244,63,94,0.4)] rounded-full transition-shadow" />
                            </button>
                          </div>
                        </div>
                        <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-3 flex items-start gap-3">
                          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-amber-400 font-bold text-[11px] uppercase tracking-wider mb-1">Academic Impact Warning</p>
                            <p className="text-amber-400/90 text-[11px] leading-relaxed font-medium">
                              Approving this event drops attendance to 72% (Critical Threshold).
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Automated Lab Viva Audit Log */}
                    <div className="flex-1 flex flex-col gap-3 min-h-0">
                      <h3 className="text-slate-300 font-bold text-[11px] uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        AI Viva Audit Log
                      </h3>
                      <div className="bg-slate-950/50 rounded-2xl border border-slate-800 overflow-hidden flex flex-col text-sm hover:border-slate-700/80 transition-all">
                        <div className="grid grid-cols-12 gap-3 bg-slate-900/90 p-3 text-slate-500 font-bold text-[9px] uppercase tracking-widest border-b border-slate-800">
                          <div className="col-span-6 pl-2">Parsed Extract</div>
                          <div className="col-span-2 text-center">Grade</div>
                          <div className="col-span-4 pr-2 text-right">Semantic Match</div>
                        </div>
                        <div className="grid grid-cols-12 gap-3 p-3 items-center group hover:bg-slate-800/40 transition-colors cursor-default border-l-2 border-transparent hover:border-cyan-400">
                          <div className="col-span-6 text-slate-300 text-xs truncate pl-1 font-mono tracking-tight">"The algorithm's primary function is..."</div>
                          <div className="col-span-2 text-center text-emerald-400 font-black bg-emerald-500/10 rounded-md py-1 border border-emerald-500/10">8/10</div>
                          <div className="col-span-4 flex items-center gap-2 pr-1">
                            <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                               <div className="h-full bg-cyan-400 w-[92%] shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                            </div>
                            <span className="text-cyan-400 text-[10px] font-black">92%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
