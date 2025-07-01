using JobTracking.API;
using JobTracking.Domain.Configuration;
using JobTracking.Application.Services;
using JobTracking.DataAccess.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models; 

var builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// ✅ Configure Swagger with JWT authentication
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Job Tracking API", Version = "v1" });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' followed by a space and your JWT token."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Bind configuration settings
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(JwtSettings.SectionName));
builder.Services.Configure<ApiSettings>(builder.Configuration.GetSection(ApiSettings.SectionName));

// Database configuration
builder.Services.AddDbContext<JobTrackingDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Application services
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<JobPostingService>();
builder.Services.AddScoped<ApplicationService>();

// Configure JWT Authentication with settings from configuration
builder.Services.ConfigureJwtAuthentication(builder.Configuration);

// Configure CORS
var apiSettings = new ApiSettings();
builder.Configuration.GetSection(ApiSettings.SectionName).Bind(apiSettings);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins(apiSettings.AllowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Ensure uploads directory exists
var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "uploads", "resumes");
Directory.CreateDirectory(uploadsPath);

// Ensure database is created (NO SEEDING)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<JobTrackingDbContext>();
    
    try
    {
        Console.WriteLine("=== STARTING DATABASE SETUP ===");
        Console.WriteLine($"🌍 Environment: {app.Environment.EnvironmentName}");
        Console.WriteLine($"🔗 Connection String: {builder.Configuration.GetConnectionString("DefaultConnection")}");

        var dbPath = Path.Combine(app.Environment.ContentRootPath, "jobtracking.db");
        if (File.Exists(dbPath))
        {
            File.Delete(dbPath);
            Console.WriteLine("🗑️ Existing database file deleted");
        }

        if (await context.Database.EnsureCreatedAsync())
        {
            Console.WriteLine("✅ New clean database created successfully");
        }

        var userCount = await context.Users.CountAsync();
        var jobCount = await context.JobPostings.CountAsync();

        Console.WriteLine($"📊 Users in database: {userCount}");
        Console.WriteLine($"💼 Job postings in database: {jobCount}");

        Console.WriteLine("=== DATABASE SETUP COMPLETE ===");
        Console.WriteLine("🎯 Clean database ready for new registrations");
        Console.WriteLine("📝 Register new accounts to get started");
        Console.WriteLine("================================");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database setup error: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
    }
}

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    Console.WriteLine("📊 Swagger UI available at: http://localhost:5000/swagger");
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowAngular");

app.UseAuthentication(); // ✅ Important: authentication must come before authorization
app.UseAuthorization();

app.MapControllers();

// Test endpoint
app.MapGet("/api/test", () =>
{
    Console.WriteLine("✅ Test endpoint hit - API routing is working");
    return Results.Ok(new { message = "API is working!", timestamp = DateTime.Now });
});

// Logging info
Console.WriteLine($"🚀 API Server starting on {apiSettings.BaseUrl}");
Console.WriteLine($"🌍 Environment: {app.Environment.EnvironmentName}");
Console.WriteLine($"🔐 JWT Authentication configured");
Console.WriteLine($"🌐 CORS allowed origins: {string.Join(", ", apiSettings.AllowedOrigins)}");
Console.WriteLine($"⚠️ HTTPS redirection: {(app.Environment.IsDevelopment() ? "DISABLED" : "ENABLED")}");
Console.WriteLine("🎯 No precoded accounts - Register to get started!");
Console.WriteLine("🔧 Controllers mapped - API endpoints should be available");

app.Run();
