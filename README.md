# StockWise - Profesyonel Stok & Son Kullanma Tarihi Takip Sistemi

StockWise; marketler, depolar ve işletmeler için ürün envanterini, kritik stok miktarlarını ve son kullanma tarihlerini (SKT) anlık olarak takip eden, modern ve kurumsal mimaride geliştirilmiş tam kapsamlı bir **Full Stack Web Uygulamasıdır**.

---

## 🚀 Öne Çıkan Özellikler

- **Gelişmiş Kontrol Paneli (Dashboard):**
  - Toplam ürün, kritik stoklu ürün, tarihi yaklaşan (7 gün) ve tarihi geçmiş ürün sayılarını gösteren canlı sayaç kartları.
  - Kartlara tıklayarak tek dokunuşla ilgili ürün grubunu filtreleyebilme.
- **Akıllı Son Kullanma Tarihi (SKT) Takibi:**
  - Tarihi geçen ürünler için anında kırmızı tehlike rozeti ve geçen gün sayısı bilgisi.
  - Tarihine 7 günden az kalan ürünler için sarı uyarı rozeti ve kalan gün sayacı.
  - Tarihi güvenli ürünler için yeşil onay rozeti.
- **Kritik Stok Uyarısı:**
  - Mevcut stok miktarı, ürün için tanımlanan minimum seviyenin altına düştüğünde sistem otomatik olarak uyarı verir.
- **Tam Kapsamlı CRUD İşlemleri:**
  - Kategori seçimi, miktar, minimum stok seviyesi ve son kullanma tarihi belirterek ürün ekleme, düzenleme ve onaylı silme.
- **Arama, Kategori Filtreleme ve Sıralama:**
  - Ürün adına göre anlık arama (search).
  - Kategoriye göre filtreleme.
  - İsim (A-Z / Z-A), Son Kullanma Tarihi ve Stok Miktarına göre sıralama (Sort by).
- **Kurumsal Hata Yönetimi & Doğrulama (Validation):**
  - Hem Frontend hem Backend üzerinde çift katmanlı veri doğrulaması (negatif stok engeli, zorunlu alanlar vb.).
  - Başarılı ve hatalı işlemler için kullanıcı dostu bildirimler (Toast).

---

## 🛠 Kullanılan Teknolojiler ve Mimari

### Backend
- **Platform:** C# / .NET 10 (ASP.NET Core Web API)
- **Mimari:** Çok Katmanlı Mimari (N-Tier Architecture: API, Business, Data, Core)
- **Veritabanı & ORM:** Microsoft SQL Server & Entity Framework Core (Code-First)
- **Dokümantasyon:** Swagger / OpenAPI UI
- **Tasarım Kalıpları:** DTO (Data Transfer Object) Deseni, Repository/Service Pattern, Dependency Injection (DI)

### Frontend
- **Kütüphane:** React (Vite)
- **Stil & Tasarım:** Tailwind CSS
- **İkon Seti:** Lucide React
- **HTTP İstemcisi:** Axios (Merkezi API Servisi ve Interceptor)

---

## 📂 Proje Dizin Yapısı

```text
StockWise/
│
├── backend/
│   ├── StockWise.sln
│   ├── StockWise.Core/         # Entity'ler, DTO'lar, Arayüzler (Interfaces)
│   ├── StockWise.Data/         # DbContext, EF Core Migration'ları, Seed Verileri
│   ├── StockWise.Business/     # İş Mantığı (Services), Filtreleme ve Doğrulama
│   └── StockWise.API/          # RESTful Controller'lar, Swagger, Program.cs
│
└── frontend/
    ├── src/
    │   ├── components/         # Navbar, DashboardStats, ProductTable, Modallar
    │   ├── services/           # api.js, productService.js, categoryService.js
    │   ├── App.jsx             # Ana Uygulama ve Durum Yönetimi (State)
    │   └── main.jsx
```

---

## 💻 Nasıl Çalıştırılır?

### 1. Gereksinimler
- [.NET SDK](https://dotnet.microsoft.com/)
- [Node.js](https://nodejs.org/)
- [Microsoft SQL Server](https://www.microsoft.com/sql-server/) (veya SQL Server Express / LocalDB)

### 2. Backend'i Başlatma
1. `backend/StockWise.API` klasörüne gidin veya `backend` klasöründe terminal açın:
   ```bash
   cd backend/StockWise.API
   dotnet run
   ```
2. API varsayılan olarak `http://localhost:5013` adresinde çalışacaktır.
3. Swagger test arayüzüne `http://localhost:5013/swagger` adresinden ulaşabilirsiniz.

### 3. Frontend'i Başlatma
1. `frontend` klasöründe yeni bir terminal açın:
   ```bash
   cd frontend
   npm run dev
   ```
2. Tarayıcınızda `http://localhost:5173` adresine giderek uygulamayı kullanmaya başlayabilirsiniz!
