namespace StockWise.Core.DTOs;

public class DashboardSummaryDto
{
    public int TotalProducts { get; set; }
    public int LowStockProductsCount { get; set; }
    public int ExpiredProductsCount { get; set; }
    public int NearingExpirationProductsCount { get; set; }
    public int TotalCategories { get; set; }
}
