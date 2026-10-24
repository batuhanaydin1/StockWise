
using Microsoft.EntityFrameworkCore;
using StockWise.Business.Services;
using StockWise.Core.Interfaces;
using StockWise.Data.Context;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// 1. Veritabanı bağlantısı
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Servis kayıtları
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

// 3. Controller ve JSON ayarları
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            ReferenceHandler.IgnoreCycles;

        options.JsonSerializerOptions.DefaultIgnoreCondition =
            JsonIgnoreCondition.WhenWritingNull;
    });

// 4. CORS ayarları
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 5. Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 6. Swagger
// Yerel geliştirme ve Docker testleri için kullanılabilir.
// Canlıya alırken erişimini sınırlandır.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "StockWise API v1");
});

// 7. CORS
app.UseCors("AllowReactApp");

// 8. HTTPS yönlendirmesi
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// 9. Yetkilendirme ve Controller'lar
app.UseAuthorization();
app.MapControllers();

// 10. Başlangıç verileri
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider
        .GetRequiredService<AppDbContext>();

    await StockWise.Data.DbInitializer.SeedAsync(context);
}

app.Run();
