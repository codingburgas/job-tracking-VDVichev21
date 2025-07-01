using JobTracking.Domain.Enums;

namespace JobTracking.Domain.DTOs;

public class JobPostingDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DatePosted { get; set; }
    public JobStatus Status { get; set; }
    public int PostedByUserId { get; set; }
    public string PostedByUserName { get; set; } = string.Empty;
    public bool CanEdit { get; set; } = false;
}