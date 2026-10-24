# StockWise — Stok ve Son Kullanma Tarihi Takip Sistemi

StockWise; ürün envanterini, stok seviyelerini ve son kullanma tarihlerini takip etmek için geliştirilmiş bir Full Stack web uygulamasıdır. Kullanıcıların ürünlerini ve kategorilerini yönetmesine, kritik stok seviyelerini izlemesine ve son kullanma tarihi yaklaşan ürünleri kolayca belirlemesine yardımcı olur.

## Özellikler

- **Kontrol Paneli:** Toplam ürün, kritik stok, son kullanma tarihi yaklaşan ve tarihi geçmiş ürünlere ilişkin özet bilgiler.
- **Son Kullanma Tarihi Takibi:** Tarihi geçmiş, tarihi yaklaşan ve güvenli durumdaki ürünleri görsel durum göstergeleriyle takip etme.
- **Kritik Stok Uyarıları:** Minimum stok seviyesinin altına düşen ürünleri belirleme.
- **Ürün Yönetimi (CRUD):** Ürün ekleme, listeleme, düzenleme ve silme.
- **Kategori Yönetimi:** Ürünleri kategorilere göre düzenleme ve filtreleme.
- **Arama ve Sıralama:** Ürün adına göre arama, kategoriye göre filtreleme ve farklı ölçütlerle sıralama.
- **Veri Doğrulama:** Hatalı veya geçersiz verilerin kaydedilmesini önlemeye yönelik kontroller.
- **REST API:** Frontend ile backend arasında HTTP üzerinden veri iletişimi.
- **Swagger / OpenAPI:** API uç noktalarını görüntüleme ve test etme.
- **Docker Desteği:** Backend uygulamasını Docker konteynerinde çalıştırma.

## Kullanılan Teknolojiler

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- Lucide React

### Backend
- C#
- .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- Microsoft SQL Server
- Swagger / OpenAPI

### Mimari ve Araçlar
- Çok katmanlı mimari (API, Business, Data, Core)
- Servis katmanı ve Dependency Injection
- DTO (Data Transfer Object)
- Git ve GitHub
- Docker

## Proje Yapısı

```text
StockWise/
├── backend/
│   ├── StockWise.API/
│   ├── StockWise.Business/
│   ├── StockWise.Core/
│   ├── StockWise.Data/
│   └── Dockerfile
└── frontend/
    └── src/
        ├── components/
        ├── services/
        ├── App.jsx
        └── main.jsx
```

## Gereksinimler

- .NET 10 SDK
- Node.js ve npm
- Microsoft SQL Server
- Docker Desktop (Docker ile çalıştırmak için)

## Yerel Ortamda Çalıştırma

### 1. Depoyu klonlama

```bash
git clone https://github.com/batuhanaydin1/StockWise.git
cd StockWise
```

### 2. Backend ve veritabanı

Backend'in veritabanı bağlantı ayarlarını kendi SQL Server ortamınıza göre yapılandırın. Bağlantı bilgilerini paylaşılabilir kaynak koduna veya herkese açık depoya gizli parola olarak eklemeyin.

Backend'i başlatmak için:

```bash
cd backend/StockWise.API
dotnet run
```

Uygulamanın adresi, yerel yapılandırmanıza bağlı olarak değişebilir.

### 3. Frontend

Yeni bir terminal açın ve proje kök dizininden aşağıdaki komutları çalıştırın:

```bash
cd frontend
npm install
npm run dev
```

Vite tarafından gösterilen yerel adresi tarayıcınızda açın. Varsayılan adres genellikle `http://localhost:5173` olur.

Frontend'in API adresini gerektiğinde `frontend/src/services/api.js` dosyasından veya `VITE_API_URL` ortam değişkeninden yapılandırabilirsiniz.

## Docker ile Backend'i Çalıştırma

Proje kök dizininden backend klasörüne geçin:

```bash
cd backend
docker build -t stockwise-api .
```

Ardından konteyneri, kendi veritabanı bağlantı ayarınızı güvenli biçimde sağlayarak çalıştırın. Örneğin, yerel geliştirme ortamında kullanılan bağlantı değişkeni `ConnectionStrings__DefaultConnection` şeklindedir.

Docker konteynerinin `8080` portunu bilgisayarınızdaki `8081` portuna eşlediğinizde API'ye şu adresten erişebilirsiniz:

- API: `http://localhost:8081`
- Swagger: `http://localhost:8081/swagger`

Bu adresler yerel geliştirme ortamı içindir. İnternette yayınlamak için ayrı sunucu, veritabanı ve ortam yapılandırması gerekir.

## Ekran Görüntüleri

Uygulamanın güncel ekran görüntüleri bu bölüme eklenecektir.

## Geliştirme Hedefleri

- Uygulamayı internette yayınlamak.
- Canlı ortam için güvenli veritabanı yapılandırması oluşturmak.
- Otomatik test kapsamını geliştirmek.
- Yeni stok yönetimi özellikleri eklemek.

## Proje Bağlantısı

GitHub: https://github.com/batuhanaydin1/StockWise

---

Bu proje, modern frontend ve backend teknolojileriyle stok ve son kullanma tarihi takibini bir araya getirmek amacıyla geliştirilmiştir.
