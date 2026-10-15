using StockWise.Core.DTOs;

namespace StockWise.Core.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllAsync(string? searchTerm = null, int? categoryId = null, string? sortBy = null);
    Task<ProductDto?> GetByIdAsync(int id);
    Task<IEnumerable<ProductDto>> GetLowStockAsync();
    Task<IEnumerable<ProductDto>> GetExpiredAsync();
    Task<IEnumerable<ProductDto>> GetNearingExpirationAsync(int daysThreshold = 7);
    Task<ProductDto> CreateAsync(CreateProductDto dto);
    Task<ProductDto?> UpdateAsync(int id, UpdateProductDto dto);
    Task<bool> DeleteAsync(int id);
    Task<DashboardSummaryDto> GetDashboardSummaryAsync();
}
