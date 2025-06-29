using System.ComponentModel.DataAnnotations;

namespace JobPortal.API.Models;

public class Application
{
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    
    [Required]
    public int JobPostingId { get; set; }
    
    [Required]
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Submitted;
    
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    
    [StringLength(255)]
    public string? ResumeFileName { get; set; }
    
    [StringLength(500)]
    public string? ResumeFilePath { get; set; }
    
    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual JobPosting JobPosting { get; set; } = null!;
}

public enum ApplicationStatus
{
    Submitted,
    SelectedForInterview,
    Rejected
}