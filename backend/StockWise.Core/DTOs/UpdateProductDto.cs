using System.ComponentModel.DataAnnotations;

namespace StockWise.Core.DTOs;

public class UpdateProductDto
{
    [Required(ErrorMessage = "Ürün adı zorunludur.")]
    [StringLength(150, MinimumLength = 2, ErrorMessage = "Ürün adı 2 ile 150 karakter arasında olmalıdır.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Kategori seçimi zorunludur.")]
    [Range(1, int.MaxValue, ErrorMessage = "Lütfen geçerli bir kategori seçiniz.")]
    public int CategoryId { get; set; }

    [Required(ErrorMessage = "Miktar zorunludur.")]
    [Range(0, 1000000, ErrorMessage = "Miktar 0 ile 1.000.000 arasında olmalıdır.")]
    public int Quantity { get; set; }

    [Required(ErrorMessage = "Minimum stok seviyesi zorunludur.")]
    [Range(0, 1000000, ErrorMessage = "Minimum stok seviyesi 0 ile 1.000.000 arasında olmalıdır.")]
    public int MinimumStockLevel { get; set; }

    [Required(ErrorMessage = "Son kullanma tarihi zorunludur.")]
    public DateTime ExpirationDate { get; set; }
}
