namespace Job.Domain.Entities;

public class JobPosting
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime PublishedDate { get; set; } = DateTime.UtcNow;
    public JobStatus Status { get; set; } = JobStatus.Active;
    public int CreatedByUserId { get; set; }
    
    public virtual User CreatedBy { get; set; } = null!;
    public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
}