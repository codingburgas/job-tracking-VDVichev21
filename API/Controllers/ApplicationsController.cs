using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using JobPortal.API.Data;
using JobPortal.API.DTOs;
using JobPortal.API.Models;
using JobPortal.API.Services;

namespace JobPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly JobPortalContext _context;
    private readonly FileUploadService _fileUploadService;

    public ApplicationsController(JobPortalContext context, FileUploadService fileUploadService)
    {
        _context = context;
        _fileUploadService = fileUploadService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetApplications()
    {
        var currentUserId = GetCurrentUserId();
        var userRole = GetCurrentUserRole();

        IQueryable<Application> query = _context.Applications
            .Include(a => a.User)
            .Include(a => a.JobPosting);

        // Users can only see their own applications
        if (userRole == UserRole.USER)
        {
            query = query.Where(a => a.UserId == currentUserId);
        }

        var applications = await query
            .Select(a => new ApplicationDto
            {
                Id = a.Id,
                UserId = a.UserId,
                JobPostingId = a.JobPostingId,
                Status = a.Status,
                SubmittedAt = a.SubmittedAt,
                UserName = $"{a.User.FirstName} {a.User.LastName}",
                JobTitle = a.JobPosting.Title,
                Company = a.JobPosting.Company,
                ResumeFileName = a.ResumeFileName,
                ResumeFilePath = a.ResumeFilePath
            })
            .OrderByDescending(a => a.SubmittedAt)
            .ToListAsync();

        return Ok(applications);
    }

    [HttpGet("job/{jobId}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetApplicationsByJob(int jobId)
    {
        var applications = await _context.Applications
            .Where(a => a.JobPostingId == jobId)
            .Include(a => a.User)
            .Include(a => a.JobPosting)
            .Select(a => new ApplicationDto
            {
                Id = a.Id,
                UserId = a.UserId,
                JobPostingId = a.JobPostingId,
                Status = a.Status,
                SubmittedAt = a.SubmittedAt,
                UserName = $"{a.User.FirstName} {a.User.LastName}",
                JobTitle = a.JobPosting.Title,
                Company = a.JobPosting.Company,
                ResumeFileName = a.ResumeFileName,
                ResumeFilePath = a.ResumeFilePath
            })
            .OrderByDescending(a => a.SubmittedAt)
            .ToListAsync();

        return Ok(applications);
    }

    [HttpPost]
    [Authorize(Roles = "USER")]
    public async Task<ActionResult<ApplicationDto>> CreateApplication([FromForm] CreateApplicationDto request)
    {
        var currentUserId = GetCurrentUserId();

        // Check if job posting exists and is active
        var jobPosting = await _context.JobPostings.FindAsync(request.JobPostingId);
        if (jobPosting == null)
        {
            return NotFound("Job posting not found");
        }

        if (jobPosting.Status != JobStatus.Active)
        {
            return BadRequest((object)"Job posting is not active");
        }

        // Check if user has already applied
        var existingApplication = await _context.Applications
            .FirstOrDefaultAsync(a => a.UserId == currentUserId && a.JobPostingId == request.JobPostingId);

        if (existingApplication != null)
        {
            return BadRequest((object)"You have already applied for this job");
        }

        var application = new Application
        {
            UserId = currentUserId,
            JobPostingId = request.JobPostingId,
            Status = ApplicationStatus.Submitted
        };

        // Handle file upload if provided
        if (request.ResumeFile != null)
        {
            var uploadResult = await _fileUploadService.UploadResumeAsync(request.ResumeFile, currentUserId);
            if (uploadResult.Success)
            {
                application.ResumeFileName = uploadResult.FileName;
                application.ResumeFilePath = uploadResult.FilePath;
            }
            else
            {
                return BadRequest((object)uploadResult.ErrorMessage!);
            }
        }

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();

        // Reload with related data
        await _context.Entry(application)
            .Reference(a => a.User)
            .LoadAsync();
        await _context.Entry(application)
            .Reference(a => a.JobPosting)
            .LoadAsync();

        var result = new ApplicationDto
        {
            Id = application.Id,
            UserId = application.UserId,
            JobPostingId = application.JobPostingId,
            Status = application.Status,
            SubmittedAt = application.SubmittedAt,
            UserName = $"{application.User.FirstName} {application.User.LastName}",
            JobTitle = application.JobPosting.Title,
            Company = application.JobPosting.Company,
            ResumeFileName = application.ResumeFileName,
            ResumeFilePath = application.ResumeFilePath
        };

        return CreatedAtAction(nameof(GetApplications), result);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> UpdateApplicationStatus(int id, UpdateApplicationStatusDto request)
    {
        var application = await _context.Applications.FindAsync(id);
        
        if (application == null)
        {
            return NotFound();
        }

        application.Status = request.Status;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("download-resume/{applicationId}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> DownloadResume(int applicationId)
    {
        var application = await _context.Applications.FindAsync(applicationId);
        
        if (application == null || string.IsNullOrEmpty(application.ResumeFilePath))
        {
            return NotFound("Resume not found");
        }

        var result = await _fileUploadService.GetResumeAsync(application.ResumeFilePath);
        if (!result.Success)
        {
            return NotFound(result.ErrorMessage);
        }

        return new FileContentResult(result.FileContent!, "application/pdf")
        {
            FileDownloadName = application.ResumeFileName
        };
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim!);
    }

    private UserRole GetCurrentUserRole()
    {
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
        return Enum.Parse<UserRole>(roleClaim!);
    }
}