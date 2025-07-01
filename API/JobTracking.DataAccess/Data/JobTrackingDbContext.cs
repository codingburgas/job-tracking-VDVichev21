using JobTracking.DataAccess.Data.Base;
using JobTracking.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace JobTracking.DataAccess.Data;

public class JobTrackingDbContext : DbContext
{
    public JobTrackingDbContext(DbContextOptions<JobTrackingDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<JobPosting> JobPostings { get; set; }
    public DbSet<Application> Applications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.Property(e => e.Role).HasConversion<string>();
        });

        modelBuilder.Entity<JobPosting>(entity =>
        {
            entity.Property(e => e.Status).HasConversion<string>();
            
            entity.HasOne(e => e.PostedByUser)
                .WithMany()
                .HasForeignKey(e => e.PostedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Application>(entity =>
        {
            entity.Property(e => e.Status).HasConversion<string>();
            entity.HasIndex(e => new { e.UserId, e.JobPostingId }).IsUnique();
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.Applications)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasOne(e => e.JobPosting)
                .WithMany(j => j.Applications)
                .HasForeignKey(e => e.JobPostingId)
                .OnDelete(DeleteBehavior.Cascade);
        });

    }
}