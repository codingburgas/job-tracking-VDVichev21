namespace Job.Domain.Entities;

public class Application
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int JobPostingId { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Submitted;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public virtual User User { get; set; } = null!;
    public virtual JobPosting JobPosting { get; set; } = null!;
}