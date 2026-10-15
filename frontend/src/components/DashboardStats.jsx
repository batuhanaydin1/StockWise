import React from 'react';
import { Package, AlertTriangle, Clock, ShieldAlert, ArrowUpRight } from 'lucide-react';

export default function DashboardStats({ summary, onCardClick, activeTab }) {
  if (!summary) return null;

  const cards = [
    {
      id: 'all',
      title: 'Toplam Envanter',
      value: summary.totalProducts,
      desc: `${summary.totalCategories} farklı kategori`,
      statusText: 'Genel Durum',
      statusColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      icon: Package,
      iconColor: 'text-indigo-600 bg-indigo-50/70',
    },
    {
      id: 'low-stock',
      title: 'Kritik Stok Uyarısı',
      value: summary.lowStockProductsCount,
      desc: 'Sipariş eşiğinin altındakiler',
      statusText: summary.lowStockProductsCount > 0 ? 'Takviye Gerekli' : 'Yeterli',
      statusColor: summary.lowStockProductsCount > 0
        ? 'text-amber-800 bg-amber-50 border-amber-200'
        : 'text-slate-600 bg-slate-100 border-slate-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-600 bg-amber-50/70',
    },
    {
      id: 'nearing-expiration',
      title: 'SKT Yaklaşanlar',
      value: summary.nearingExpirationProductsCount,
      desc: 'Önümüzdeki 7 gün içinde',
      statusText: summary.nearingExpirationProductsCount > 0 ? 'Öncelikli Satış' : 'Risk Yok',
      statusColor: summary.nearingExpirationProductsCount > 0
        ? 'text-orange-800 bg-orange-50 border-orange-200'
        : 'text-slate-600 bg-slate-100 border-slate-200',
      icon: Clock,
      iconColor: 'text-orange-600 bg-orange-50/70',
    },
    {
      id: 'expired',
      title: 'Tarihi Geçen Ürünler',
      value: summary.expiredProductsCount,
      desc: 'Derhal raftan çekilmeli',
      statusText: summary.expiredProductsCount > 0 ? 'İmha / İade' : 'Temiz',
      statusColor: summary.expiredProductsCount > 0
        ? 'text-rose-700 bg-rose-50 border-rose-200'
        : 'text-emerald-700 bg-emerald-50 border-emerald-200',
      icon: ShieldAlert,
      iconColor: 'text-rose-600 bg-rose-50/70',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeTab === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onCardClick(card.id)}
            className={`cursor-pointer rounded-2xl p-5 transition-all duration-150 bg-white border ${
              isSelected
                ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md -translate-y-0.5'
                : 'border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            {/* Üst Kısım: Başlık & Durum Rozeti */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500">{card.title}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${card.statusColor}`}>
                {card.statusText}
              </span>
            </div>

            {/* Orta Kısım: Rakam & İkon */}
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Alt Kısım: Açıklama ve Hızlı Geçiş */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="truncate">{card.desc}</span>
              <span className="flex items-center text-indigo-600 font-semibold shrink-0 ml-2 hover:underline">
                Filtrele <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
