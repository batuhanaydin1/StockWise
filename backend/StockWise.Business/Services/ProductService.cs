using Microsoft.EntityFrameworkCore;
using StockWise.Core.DTOs;
using StockWise.Core.Entities;
using StockWise.Core.Interfaces;
using StockWise.Data.Context;

namespace StockWise.Business.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;

    public ProductService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync(string? searchTerm = null, int? categoryId = null, string? sortBy = null)
    {
        var query = _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .AsQueryable();

        // 1. Arama Filtresi (Ürün Adına Göre)
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(term));
        }

        // 2. Kategori Filtresi
        if (categoryId.HasValue && categoryId.Value > 0)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }

        // 3. Sıralama (Sort By)
        query = sortBy?.ToLower() switch
        {
            "name_desc" => query.OrderByDescending(p => p.Name),
            "date_asc" => query.OrderBy(p => p.ExpirationDate),
            "date_desc" => query.OrderByDescending(p => p.ExpirationDate),
            "quantity_asc" => query.OrderBy(p => p.Quantity),
            "quantity_desc" => query.OrderByDescending(p => p.Quantity),
            _ => query.OrderBy(p => p.Name) // Varsayılan: İsim alfabetik (A-Z)
        };

        var products = await query.ToListAsync();
        return products.Select(MapToDto);
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var product = await _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        return product == null ? null : MapToDto(product);
    }

    public async Task<IEnumerable<ProductDto>> GetLowStockAsync()
    {
        var products = await _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Where(p => p.Quantity <= p.MinimumStockLevel)
            .OrderBy(p => p.Quantity)
            .ToListAsync();

        return products.Select(MapToDto);
    }

    public async Task<IEnumerable<ProductDto>> GetExpiredAsync()
    {
        var today = DateTime.UtcNow.Date;
        var products = await _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Where(p => p.ExpirationDate.Date < today)
            .OrderBy(p => p.ExpirationDate)
            .ToListAsync();

        return products.Select(MapToDto);
    }

    public async Task<IEnumerable<ProductDto>> GetNearingExpirationAsync(int daysThreshold = 7)
    {
        var today = DateTime.UtcNow.Date;
        var thresholdDate = today.AddDays(daysThreshold);

        var products = await _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Where(p => p.ExpirationDate.Date >= today && p.ExpirationDate.Date <= thresholdDate)
            .OrderBy(p => p.ExpirationDate)
            .ToListAsync();

        return products.Select(MapToDto);
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name.Trim(),
            CategoryId = dto.CategoryId,
            Quantity = dto.Quantity,
            MinimumStockLevel = dto.MinimumStockLevel,
            ExpirationDate = dto.ExpirationDate,
            CreatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // Kategori bilgisini yükleyelim
        await _context.Entry(product).Reference(p => p.Category).LoadAsync();

        return MapToDto(product);
    }

    public async Task<ProductDto?> UpdateAsync(int id, UpdateProductDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return null;

        product.Name = dto.Name.Trim();
        product.CategoryId = dto.CategoryId;
        product.Quantity = dto.Quantity;
        product.MinimumStockLevel = dto.MinimumStockLevel;
        product.ExpirationDate = dto.ExpirationDate;

        await _context.SaveChangesAsync();
        await _context.Entry(product).Reference(p => p.Category).LoadAsync();

        return MapToDto(product);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
    {
        var today = DateTime.UtcNow.Date;
        var nearingThreshold = today.AddDays(7);

        var totalProducts = await _context.Products.CountAsync();
        var lowStockCount = await _context.Products.CountAsync(p => p.Quantity <= p.MinimumStockLevel);
        var expiredCount = await _context.Products.CountAsync(p => p.ExpirationDate.Date < today);
        var nearingExpirationCount = await _context.Products.CountAsync(p => p.ExpirationDate.Date >= today && p.ExpirationDate.Date <= nearingThreshold);
        var totalCategories = await _context.Categories.CountAsync();

        return new DashboardSummaryDto
        {
            TotalProducts = totalProducts,
            LowStockProductsCount = lowStockCount,
            ExpiredProductsCount = expiredCount,
            NearingExpirationProductsCount = nearingExpirationCount,
            TotalCategories = totalCategories
        };
    }

    private static ProductDto MapToDto(Product p)
    {
        return new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            CategoryId = p.CategoryId,
            CategoryName = p.Category?.Name ?? "Belirtilmemiş",
            Quantity = p.Quantity,
            MinimumStockLevel = p.MinimumStockLevel,
            ExpirationDate = p.ExpirationDate,
            CreatedAt = p.CreatedAt
        };
    }
}
