using JobTracking.API;
using JobTracking.Domain.Configuration;
using JobTracking.Application.Services;
using JobTracking.DataAccess.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models; 

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

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

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(JwtSettings.SectionName));
builder.Services.Configure<ApiSettings>(builder.Configuration.GetSection(ApiSettings.SectionName));

builder.Services.AddDbContext<JobTrackingDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<JobPostingService>();
builder.Services.AddScoped<ApplicationService>();

builder.Services.ConfigureJwtAuthentication(builder.Configuration);

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

var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "uploads", "resumes");
Directory.CreateDirectory(uploadsPath);

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<JobTrackingDbContext>();

}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/api/test", () =>
{
    return Results.Ok(new { message = "API is working!", timestamp = DateTime.Now });
});

app.Run();
