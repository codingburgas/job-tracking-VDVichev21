using JobTracking.Domain.Enums;

namespace JobTracking.Domain.DTOs;

public class ApplicationDto
{
    public int Id { get; set; }
    public int JobPostingId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public ApplicationStatus Status { get; set; }
    public DateTime DateApplied { get; set; }
    public string? ResumeFileName { get; set; }
    public string? ResumeFilePath { get; set; }
}