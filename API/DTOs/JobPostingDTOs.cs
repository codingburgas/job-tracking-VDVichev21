using System.ComponentModel.DataAnnotations;
using JobPortal.API.Models;

namespace JobPortal.API.DTOs;

public class CreateJobPostingDto
{
    [Required]
    [StringLength(100)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string Company { get; set; } = string.Empty;
    
    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;
}

public class UpdateJobPostingDto
{
    [StringLength(100)]
    public string? Title { get; set; }
    
    [StringLength(100)]
    public string? Company { get; set; }
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    public JobStatus? Status { get; set; }
}

public class JobPostingDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DatePosted { get; set; }
    public JobStatus Status { get; set; }
    public int ApplicationCount { get; set; }
    public bool UserHasApplied { get; set; }
}