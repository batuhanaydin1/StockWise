import React from 'react';
import { Edit3, Trash2, AlertCircle, Calendar } from 'lucide-react';

export default function ProductTable({ products, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-16 text-center shadow-xs">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-indigo-600 border-t-transparent mb-3"></div>
        <p className="text-xs font-medium text-slate-500">Ürün verileri getiriliyor...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-16 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Eşleşen ürün kaydı bulunamadı</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Arama kriterlerinizi değiştirmeyi deneyin veya sağ üstteki butondan yeni ürün ekleyin.
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-5 py-3.5">Ürün Tanımı</th>
              <th scope="col" className="px-5 py-3.5">Kategori</th>
              <th scope="col" className="px-5 py-3.5">Mevcut Stok</th>
              <th scope="col" className="px-5 py-3.5">Min. Eşik</th>
              <th scope="col" className="px-5 py-3.5">Son Kullanma Tarihi</th>
              <th scope="col" className="px-5 py-3.5">Raf Durumu</th>
              <th scope="col" className="px-5 py-3.5 text-right">Eylemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => {
              // Raf Durumu Rozeti
              let statusBadge = null;
              if (p.isExpired) {
                statusBadge = (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
                    Tarihi Geçti ({Math.abs(p.daysUntilExpiration)} gün önce)
                  </span>
                );
              } else if (p.isNearingExpiration) {
                statusBadge = (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                    {p.daysUntilExpiration === 0 ? 'Bugün Son Gün!' : `${p.daysUntilExpiration} gün kaldı`}
                  </span>
                );
              } else {
                statusBadge = (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                    Güvenli ({p.daysUntilExpiration} gün)
                  </span>
                );
              }

              return (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Ürün Adı */}
                  <td className="px-5 py-3.5 font-semibold text-slate-900">
                    {p.name}
                  </td>

                  {/* Kategori */}
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {p.categoryName}
                    </span>
                  </td>

                  {/* Stok */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${p.isLowStock ? 'text-amber-700' : 'text-slate-900'}`}>
                        {p.quantity} Adet
                      </span>
                      {p.isLowStock && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          KRİTİK
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Minimum Stok */}
                  <td className="px-5 py-3.5 text-slate-500 font-medium">
                    {p.minimumStockLevel} Adet
                  </td>

                  {/* SKT Tarihi */}
                  <td className="px-5 py-3.5 text-slate-600 font-medium">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(p.expirationDate)}</span>
                    </div>
                  </td>

                  {/* Rozet */}
                  <td className="px-5 py-3.5">
                    {statusBadge}
                  </td>

                  {/* Aksiyonlar */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onEdit(p)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(p)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
