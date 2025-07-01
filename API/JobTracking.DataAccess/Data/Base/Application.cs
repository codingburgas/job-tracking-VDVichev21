using JobTracking.Domain.Enums;

namespace JobTracking.DataAccess.Data.Base;

public class Application
{
    public int Id { get; set; }
    public int JobPostingId { get; set; }
    public int UserId { get; set; }
    public ApplicationStatus Status { get; set; }
    public DateTime DateApplied { get; set; }
    public string? ResumeFileName { get; set; }
    public string? ResumeFilePath { get; set; }

    public JobPosting JobPosting { get; set; } = null!;
    public User User { get; set; } = null!;
}