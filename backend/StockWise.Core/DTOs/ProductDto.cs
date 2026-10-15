namespace StockWise.Core.DTOs;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int MinimumStockLevel { get; set; }
    public DateTime ExpirationDate { get; set; }
    public DateTime CreatedAt { get; set; }

    // Frontend için hesaplanan yardımcı durum alanları
    public bool IsLowStock => Quantity <= MinimumStockLevel;
    public bool IsExpired => ExpirationDate.Date < DateTime.UtcNow.Date;
    public bool IsNearingExpiration => !IsExpired && (ExpirationDate.Date - DateTime.UtcNow.Date).TotalDays <= 7;
    public int DaysUntilExpiration => (int)(ExpirationDate.Date - DateTime.UtcNow.Date).TotalDays;
}
