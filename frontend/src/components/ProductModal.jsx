import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

export default function ProductModal({ isOpen, onClose, onSave, product, categories }) {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    quantity: '',
    minimumStockLevel: '',
    expirationDate: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        categoryId: product.categoryId || '',
        quantity: product.quantity ?? '',
        minimumStockLevel: product.minimumStockLevel ?? '',
        expirationDate: product.expirationDate ? product.expirationDate.split('T')[0] : '',
      });
    } else {
      setFormData({
        name: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        quantity: '',
        minimumStockLevel: '',
        expirationDate: '',
      });
    }
    setErrors({});
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Ürün adı zorunludur.';
    if (!formData.categoryId) newErrors.categoryId = 'Lütfen kategori seçin.';
    if (formData.quantity === '' || isNaN(formData.quantity) || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Geçerli bir miktar girin (0 veya üzeri).';
    }
    if (formData.minimumStockLevel === '' || isNaN(formData.minimumStockLevel) || Number(formData.minimumStockLevel) < 0) {
      newErrors.minimumStockLevel = 'Geçerli bir kritik stok seviyesi girin.';
    }
    if (!formData.expirationDate) {
      newErrors.expirationDate = 'Son kullanma tarihi zorunludur.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSave({
        name: formData.name.trim(),
        categoryId: parseInt(formData.categoryId, 10),
        quantity: parseInt(formData.quantity, 10),
        minimumStockLevel: parseInt(formData.minimumStockLevel, 10),
        expirationDate: new Date(formData.expirationDate).toISOString(),
      });
      onClose();
    } catch (err) {
      console.error(err);
      setErrors({ form: err.response?.data?.message || 'İşlem sırasında bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {product ? 'Ürün Kaydını Güncelle' : 'Yeni Ürün Ekle'}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Stok parametrelerini ve son kullanma tarihini belirleyin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.form && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Ürün Adı */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Ürün Adı
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Örn: Tam Yağlı Süt 1L"
              className={`w-full px-3.5 py-2 rounded-xl bg-slate-50/50 border text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 transition-all ${
                errors.name
                  ? 'border-rose-300 focus:ring-rose-500'
                  : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-600'
              }`}
            />
            {errors.name && <p className="text-rose-600 text-[11px] mt-1">{errors.name}</p>}
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Kategori
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-xl bg-slate-50/50 border text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-1 transition-all ${
                errors.categoryId
                  ? 'border-rose-300 focus:ring-rose-500'
                  : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-600'
              }`}
            >
              <option value="">Kategori Seçin...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-rose-600 text-[11px] mt-1">{errors.categoryId}</p>}
          </div>

          {/* Miktar ve Minimum Stok */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Stok Miktarı
              </label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0"
                className={`w-full px-3.5 py-2 rounded-xl bg-slate-50/50 border text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 transition-all ${
                  errors.quantity
                    ? 'border-rose-300 focus:ring-rose-500'
                    : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-600'
                }`}
              />
              {errors.quantity && <p className="text-rose-600 text-[11px] mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Kritik Eşik Seviyesi
              </label>
              <input
                type="number"
                min="0"
                value={formData.minimumStockLevel}
                onChange={(e) => setFormData({ ...formData, minimumStockLevel: e.target.value })}
                placeholder="Örn: 5"
                className={`w-full px-3.5 py-2 rounded-xl bg-slate-50/50 border text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 transition-all ${
                  errors.minimumStockLevel
                    ? 'border-rose-300 focus:ring-rose-500'
                    : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-600'
                }`}
              />
              {errors.minimumStockLevel && (
                <p className="text-rose-600 text-[11px] mt-1">{errors.minimumStockLevel}</p>
              )}
            </div>
          </div>

          {/* Son Kullanma Tarihi */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Son Kullanma Tarihi (SKT)
            </label>
            <input
              type="date"
              value={formData.expirationDate}
              onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-xl bg-slate-50/50 border text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-1 transition-all ${
                errors.expirationDate
                  ? 'border-rose-300 focus:ring-rose-500'
                  : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-600'
              }`}
            />
            {errors.expirationDate && (
              <p className="text-rose-600 text-[11px] mt-1">{errors.expirationDate}</p>
            )}
          </div>

          {/* Footer Butonları */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? 'İşleniyor...' : product ? 'Güncelle' : 'Kaydet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
