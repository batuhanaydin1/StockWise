using Microsoft.EntityFrameworkCore;
using StockWise.Core.Entities;

namespace StockWise.Data.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Kategori yapılandırması
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
            entity.Property(c => c.Description).HasMaxLength(250);
        });

        // Ürün yapılandırması
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(150);
            entity.Property(p => p.Quantity).IsRequired();
            entity.Property(p => p.MinimumStockLevel).IsRequired();
            entity.Property(p => p.ExpirationDate).IsRequired();

            // İlişki: 1 Kategori -> Çok Ürün
            entity.HasOne(p => p.Category)
                  .WithMany(c => c.Products)
                  .HasForeignKey(p => p.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Başlangıç Verileri (Seed Data)
        // Böylece veritabanı kurulduğunda kategorilerimiz hazır olacak
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Süt & Kahvaltılık", Description = "Peynir, süt, tereyağı vb." },
            new Category { Id = 2, Name = "Temel Gıda", Description = "Bakliyat, un, makarna, yağ vb." },
            new Category { Id = 3, Name = "İçecek", Description = "Su, meyve suyu, çay, kahve vb." },
            new Category { Id = 4, Name = "Atıştırmalık", Description = "Bisküvi, çikolata, cips vb." }
        );
    }
}
