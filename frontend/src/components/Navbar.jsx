import React from 'react';
import { Package, ShieldAlert, Clock, AlertTriangle, Layers } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, summary }) {
  const navItems = [
    { id: 'all', label: 'Tüm Envanter', icon: Package, count: summary?.totalProducts },
    { id: 'low-stock', label: 'Kritik Stok', icon: AlertTriangle, count: summary?.lowStockProductsCount, variant: 'amber' },
    { id: 'nearing-expiration', label: 'SKT Yaklaşan', icon: Clock, count: summary?.nearingExpirationProductsCount, variant: 'orange' },
    { id: 'expired', label: 'SKT Geçmiş', icon: ShieldAlert, count: summary?.expiredProductsCount, variant: 'rose' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('all')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold tracking-tight text-white">StockWise</span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
                  Canlı
                </span>
              </div>
              <span className="block text-[11px] text-slate-400 font-normal">Stok & Raf Takip Sistemi</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                        item.variant === 'rose'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : item.variant === 'amber' || item.variant === 'orange'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
