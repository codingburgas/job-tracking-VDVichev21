namespace JobTracking.Domain.DTOs;

public class CreateJobPostingDto
{
    public string Title { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}