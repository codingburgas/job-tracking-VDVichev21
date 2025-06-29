using System.ComponentModel.DataAnnotations;

namespace JobPortal.API.Models;

public class JobPosting
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string Company { get; set; } = string.Empty;
    
    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    public DateTime DatePosted { get; set; } = DateTime.UtcNow;
    
    [Required]
    public JobStatus Status { get; set; } = JobStatus.Active;
    
    // Navigation properties
    public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
}

public enum JobStatus
{
    Active,
    Inactive
}