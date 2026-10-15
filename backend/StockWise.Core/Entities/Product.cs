namespace StockWise.Core.Entities;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int MinimumStockLevel { get; set; }
    public DateTime ExpirationDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Kategori ile ilişki (Foreign Key)
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
}
