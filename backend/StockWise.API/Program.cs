using Microsoft.EntityFrameworkCore;
using StockWise.Business.Services;
using StockWise.Core.Interfaces;
using StockWise.Data.Context;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// 1. Veritabanı Bağlantısı (SQL Server & EF Core)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Dependency Injection - Servis Kayıtları
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

// 2. Controller ve JSON Döngüsel Referans Ayarları
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Entity'ler arası ilişkilerde sonsuz JSON döngüsünü engeller
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// 3. CORS Ayarı (React Frontend'in API'ye erişebilmesi için şarttır)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // Vite ve React varsayılan portları
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 4. Swagger / OpenAPI Desteği (API'leri tarayıcıdan test etmek için)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// HTTP İstek Hattı (Pipeline)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "StockWise API v1");
    });
}

// CORS'u en başta aktif ediyoruz (Tarayıcı engellerini önlemek için)
app.UseCors("AllowReactApp");

// Geliştirme ortamında gereksiz HTTPS yönlendirme hatalarını önleyelim
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

// Başlangıç test ürünlerini ekle (Seed Data)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await StockWise.Data.DbInitializer.SeedAsync(context);
}

app.Run();
