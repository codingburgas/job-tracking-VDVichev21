using Microsoft.EntityFrameworkCore;
using JobPortal.API.Models;

namespace JobPortal.API.Data;

public class JobPortalContext : DbContext
{
    public JobPortalContext(DbContextOptions<JobPortalContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<JobPosting> JobPostings { get; set; }
    public DbSet<Application> Applications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.Property(e => e.Role).HasConversion<string>();
        });

        // JobPosting configuration
        modelBuilder.Entity<JobPosting>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).HasConversion<string>();
        });

        // Application configuration
        modelBuilder.Entity<Application>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).HasConversion<string>();
            
            // Composite unique constraint: one application per user per job
            entity.HasIndex(e => new { e.UserId, e.JobPostingId }).IsUnique();
            
            entity.HasOne(e => e.User)
                .WithMany(e => e.Applications)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.JobPosting)
                .WithMany(e => e.Applications)
                .HasForeignKey(e => e.JobPostingId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed admin user
        var adminPasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123");
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                FirstName = "Admin",
                LastName = "User",
                Username = "admin",
                PasswordHash = adminPasswordHash,
                Role = UserRole.ADMIN,
                CreatedAt = DateTime.UtcNow
            }
        );
    }
}