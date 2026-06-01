"use client";

import React, { useState } from 'react';
import { BookOpen, BarChart3, TrendingUp } from 'lucide-react';

import Journal from './journal';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('charts'); // 'charts' or 'journal'

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">

      {/* SIDEBAR */}
      <aside className="w-20 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-6 gap-8">
        {/* Logo */}
        <div className="text-emerald-500 p-2 bg-emerald-500/10 rounded-xl">
          <TrendingUp size={28} />
        </div>

        <hr className="w-8 border-slate-800" />

        {/* Navigation */}
        <nav className="flex flex-col gap-4 flex-1 w-full px-3">
          {/* Charts Toggle */}
          <button
            onClick={() => setActiveTab('charts')}
            className={`w-full py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'charts'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <BarChart3 size={22} />
            <span className="text-[10px] font-medium">Charts</span>
          </button>

          {/* Journal Toggle (Notebook) */}
          <button
            onClick={() => setActiveTab('journal')}
            className={`w-full py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'journal'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <BookOpen size={22} />
            <span className="text-[10px] font-medium">Journal</span>
          </button>
        </nav>

        {/* Profile Avatar Placeholder */}
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
          TR
        </div>
      </aside>

      {/* MAIN LAYOUT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur px-8 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-wide capitalize">
            {activeTab === 'charts' ? 'Analytics & Charts' : 'Trading Journal'}
          </h1>
          <div className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
            Live Feed Connected
          </div>
        </header>

        {/* Component Screen Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
          <div className="max-w-7xl mx-auto h-full">
            {/*{activeTab === 'charts' ? <Chart /> : <Journal />}*/}
            <Journal />
          </div>
        </div>
      </main>

    </div>
  );
}