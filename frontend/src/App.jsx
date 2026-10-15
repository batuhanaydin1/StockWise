import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { productService } from './services/productService';
import { categoryService } from './services/categoryService';
import { Plus, Search, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Filtreleme & Sıralama
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');

  // Yüklenme & Modal Durumları
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const loadMetadata = async () => {
    try {
      const [summaryData, categoriesData] = await Promise.all([
        productService.getDashboardSummary(),
        categoryService.getAll(),
      ]);
      setSummary(summaryData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Metadata yüklenirken hata:', err);
    }
  };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      let data = [];
      if (activeTab === 'low-stock') {
        data = await productService.getLowStock();
      } else if (activeTab === 'nearing-expiration') {
        data = await productService.getNearingExpiration(7);
      } else if (activeTab === 'expired') {
        data = await productService.getExpired();
      } else {
        data = await productService.getAll({
          searchTerm: searchTerm || undefined,
          categoryId: selectedCategory ? parseInt(selectedCategory, 10) : undefined,
          sortBy,
        });
      }

      if (activeTab !== 'all' && searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        data = data.filter((p) => p.name.toLowerCase().includes(term));
      }
      if (activeTab !== 'all' && selectedCategory) {
        data = data.filter((p) => p.categoryId === parseInt(selectedCategory, 10));
      }

      setProducts(data);
    } catch (err) {
      console.error('Ürünler yüklenirken hata:', err);
      showNotification('error', 'API ile bağlantı kurulamadı.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    loadMetadata();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProducts();
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [loadProducts]);

  const handleSaveProduct = async (productData) => {
    if (editingProduct) {
      await productService.update(editingProduct.id, productData);
      showNotification('success', 'Ürün başarıyla güncellendi.');
    } else {
      await productService.create(productData);
      showNotification('success', 'Yeni ürün başarıyla eklendi.');
    }
    await loadMetadata();
    await loadProducts();
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setDeleteLoading(true);
    try {
      await productService.delete(productToDelete.id);
      showNotification('success', `"${productToDelete.name}" silindi.`);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      await loadMetadata();
      await loadProducts();
    } catch (err) {
      console.error(err);
      showNotification('error', 'Silme işlemi başarısız oldu.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getTabHeader = () => {
    switch (activeTab) {
      case 'low-stock':
        return {
          title: 'Kritik Stok Seviyesindeki Ürünler',
          description: 'Miktarı belirlenen güvenlik stok eşiğinin altında kalan ürünler.',
        };
      case 'nearing-expiration':
        return {
          title: 'Son Kullanma Tarihi Yaklaşanlar',
          description: 'Önümüzdeki 7 gün içerisinde son kullanma tarihi dolacak ürünler.',
        };
      case 'expired':
        return {
          title: 'Son Kullanma Tarihi Geçmiş Ürünler',
          description: 'Raftan acilen çekilmesi veya iade edilmesi gereken ürünler.',
        };
      default:
        return {
          title: 'Envanter ve Stok Yönetimi',
          description: 'Kayıtlı ürünlerinizi arayın, filtreleyin ve anlık takip edin.',
        };
    }
  };

  const tabHeader = getTabHeader();

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col font-sans">
      {/* Üst Bar (Koyu Slate Kontrastlı) */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} summary={summary} />

      {/* Ana Gövde */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* Bildirim Toast */}
        {notification && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-200 ${
              notification.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-200'
                : 'bg-rose-600 text-white border-rose-500 shadow-rose-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Dashboard Metrik Kartları */}
        <DashboardStats
          summary={summary}
          onCardClick={(tab) => setActiveTab(tab)}
          activeTab={activeTab}
        />

        {/* Aksiyon ve Filtreleme Kartı */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 mb-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{tabHeader.title}</h1>
              <p className="text-xs text-slate-500 mt-0.5">{tabHeader.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  loadMetadata();
                  loadProducts();
                }}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                title="Yenile"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Ürün Ekle</span>
              </button>
            </div>
          </div>

          {/* Filtre Barı */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-4 border-t border-slate-100">
            {/* Arama Kutusu */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Ürün adı ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50/60 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
              />
            </div>

            {/* Kategori Filtresi */}
            <div className="sm:col-span-4 relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/60 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.productCount})
                  </option>
                ))}
              </select>
            </div>

            {/* Sıralama */}
            <div className="sm:col-span-3 relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/60 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
              >
                <option value="name_asc">İsim (A - Z)</option>
                <option value="name_desc">İsim (Z - A)</option>
                <option value="date_asc">SKT (En Yakın Önce)</option>
                <option value="date_desc">SKT (En Uzak Önce)</option>
                <option value="quantity_asc">Stok (Azdan Çoğa)</option>
                <option value="quantity_desc">Stok (Çoktan Aza)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ürün Listeleme Tablosu */}
        <ProductTable
          products={products}
          loading={loading}
          onEdit={(product) => {
            setEditingProduct(product);
            setIsModalOpen(true);
          }}
          onDelete={(product) => {
            setProductToDelete(product);
            setIsDeleteModalOpen(true);
          }}
        />
      </main>

      {/* Modal Pencereleri */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        product={productToDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
