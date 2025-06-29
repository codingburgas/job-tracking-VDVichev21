using System.ComponentModel.DataAnnotations;
using JobPortal.API.Models;

namespace JobPortal.API.DTOs;

public class CreateApplicationDto
{
    [Required]
    public int JobPostingId { get; set; }
    
    public IFormFile? ResumeFile { get; set; }
}

public class UpdateApplicationStatusDto
{
    [Required]
    public ApplicationStatus Status { get; set; }
}

public class ApplicationDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int JobPostingId { get; set; }
    public ApplicationStatus Status { get; set; }
    public DateTime SubmittedAt { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string? ResumeFileName { get; set; }
    public string? ResumeFilePath { get; set; }
}