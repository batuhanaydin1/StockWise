using StockWise.Core.Entities;
using StockWise.Data.Context;

namespace StockWise.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Eğer veritabanında zaten ürün varsa tekrar ekleme yapma
        if (context.Products.Any())
        {
            return;
        }

        var today = DateTime.UtcNow.Date;

        var sampleProducts = new List<Product>
        {
            // 1. Normal Durumdaki Ürün
            new()
            {
                Name = "Tam Yağlı Süt 1L",
                CategoryId = 1, // Süt & Kahvaltılık
                Quantity = 45,
                MinimumStockLevel = 10,
                ExpirationDate = today.AddDays(25),
                CreatedAt = today.AddDays(-5)
            },
            // 2. Kritik Stok Seviyesindeki Ürün (Miktar <= Minimum)
            new()
            {
                Name = "Beyaz Peynir 500g",
                CategoryId = 1,
                Quantity = 3,
                MinimumStockLevel = 8,
                ExpirationDate = today.AddDays(18),
                CreatedAt = today.AddDays(-10)
            },
            // 3. Tarihi Yaklaşan Ürün (Örn: 3 gün kalmış)
            new()
            {
                Name = "Taze Kaşar Peyniri 400g",
                CategoryId = 1,
                Quantity = 12,
                MinimumStockLevel = 5,
                ExpirationDate = today.AddDays(3),
                CreatedAt = today.AddDays(-20)
            },
            // 4. Son Kullanma Tarihi Geçmiş Ürün (Örn: 4 gün önce geçmiş)
            new()
            {
                Name = "Organik Yoğurt 1kg",
                CategoryId = 1,
                Quantity = 7,
                MinimumStockLevel = 5,
                ExpirationDate = today.AddDays(-4),
                CreatedAt = today.AddDays(-30)
            },
            // 5. Temel Gıda - Normal Stok
            new()
            {
                Name = "Kırmızı Mercimek 1kg",
                CategoryId = 2, // Temel Gıda
                Quantity = 60,
                MinimumStockLevel = 15,
                ExpirationDate = today.AddDays(180),
                CreatedAt = today.AddDays(-2)
            },
            // 6. İçecek - Hem Kritik Stok Hem Tarihi Yaklaşan Ürün
            new()
            {
                Name = "Taze Sıkma Portakal Suyu 1L",
                CategoryId = 3, // İçecek
                Quantity = 2,
                MinimumStockLevel = 6,
                ExpirationDate = today.AddDays(2),
                CreatedAt = today.AddDays(-8)
            }
        };

        await context.Products.AddRangeAsync(sampleProducts);
        await context.SaveChangesAsync();
    }
}
