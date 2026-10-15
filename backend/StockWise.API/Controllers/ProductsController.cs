using Microsoft.AspNetCore.Mvc;
using StockWise.Core.DTOs;
using StockWise.Core.Interfaces;

namespace StockWise.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    /// <summary>
    /// Ürünleri listeler, filtreler ve sıralar.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? searchTerm,
        [FromQuery] int? categoryId,
        [FromQuery] string? sortBy)
    {
        var products = await _productService.GetAllAsync(searchTerm, categoryId, sortBy);
        return Ok(products);
    }

    /// <summary>
    /// ID'ye göre ürün getirir.
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _productService.GetByIdAsync(id);
        if (product == null)
        {
            return NotFound(new { message = $"ID'si {id} olan ürün bulunamadı." });
        }
        return Ok(product);
    }

    /// <summary>
    /// Stok miktarı minimum seviyenin altında olan kritik stoklu ürünleri listeler.
    /// </summary>
    [HttpGet("low-stock")]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLowStock()
    {
        var products = await _productService.GetLowStockAsync();
        return Ok(products);
    }

    /// <summary>
    /// Son kullanma tarihi geçmiş ürünleri listeler.
    /// </summary>
    [HttpGet("expired")]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetExpired()
    {
        var products = await _productService.GetExpiredAsync();
        return Ok(products);
    }

    /// <summary>
    /// Son kullanma tarihi yaklaşan (varsayılan 7 gün) ürünleri listeler.
    /// </summary>
    [HttpGet("nearing-expiration")]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetNearingExpiration([FromQuery] int days = 7)
    {
        var products = await _productService.GetNearingExpirationAsync(days);
        return Ok(products);
    }

    /// <summary>
    /// Kontrol paneli için özet istatistikleri döner.
    /// </summary>
    [HttpGet("dashboard-summary")]
    [ProducesResponseType(typeof(DashboardSummaryDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDashboardSummary()
    {
        var summary = await _productService.GetDashboardSummaryAsync();
        return Ok(summary);
    }

    /// <summary>
    /// Yeni ürün ekler.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var createdProduct = await _productService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = createdProduct.Id }, createdProduct);
    }

    /// <summary>
    /// Mevcut bir ürünü günceller.
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updatedProduct = await _productService.UpdateAsync(id, dto);
        if (updatedProduct == null)
        {
            return NotFound(new { message = $"ID'si {id} olan ürün bulunamadı." });
        }

        return Ok(updatedProduct);
    }

    /// <summary>
    /// Ürünü siler.
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _productService.DeleteAsync(id);
        if (!result)
        {
            return NotFound(new { message = $"ID'si {id} olan ürün bulunamadı." });
        }

        return NoContent();
    }
}
