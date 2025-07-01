using JobTracking.Domain.Enums;

namespace JobTracking.DataAccess.Data.Base;

public class JobPosting
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DatePosted { get; set; }
    public JobStatus Status { get; set; } = JobStatus.Active;
    public int PostedByUserId { get; set; } 

    public User PostedByUser { get; set; } = null!;
    public ICollection<Application> Applications { get; set; } = new List<Application>();
}