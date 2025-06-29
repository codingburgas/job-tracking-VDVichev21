using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using JobPortal.API.Data;
using JobPortal.API.DTOs;
using JobPortal.API.Models;

namespace JobPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class JobPostingsController : ControllerBase
{
    private readonly JobPortalContext _context;

    public JobPostingsController(JobPortalContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<JobPostingDto>>> GetJobPostings()
    {
        var userId = GetCurrentUserId();
        
        var jobPostings = await _context.JobPostings
            .Where(j => j.Status == JobStatus.Active)
            .Include(j => j.Applications)
            .Select(j => new JobPostingDto
            {
                Id = j.Id,
                Title = j.Title,
                Company = j.Company,
                Description = j.Description,
                DatePosted = j.DatePosted,
                Status = j.Status,
                ApplicationCount = j.Applications.Count,
                UserHasApplied = userId.HasValue && j.Applications.Any(a => a.UserId == userId.Value)
            })
            .OrderByDescending(j => j.DatePosted)
            .ToListAsync();

        return Ok(jobPostings);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<JobPostingDto>> GetJobPosting(int id)
    {
        var userId = GetCurrentUserId();
        
        var jobPosting = await _context.JobPostings
            .Include(j => j.Applications)
            .Where(j => j.Id == id)
            .Select(j => new JobPostingDto
            {
                Id = j.Id,
                Title = j.Title,
                Company = j.Company,
                Description = j.Description,
                DatePosted = j.DatePosted,
                Status = j.Status,
                ApplicationCount = j.Applications.Count,
                UserHasApplied = userId.HasValue && j.Applications.Any(a => a.UserId == userId.Value)
            })
            .FirstOrDefaultAsync();

        if (jobPosting == null)
        {
            return NotFound();
        }

        return Ok(jobPosting);
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<JobPostingDto>> CreateJobPosting(CreateJobPostingDto request)
    {
        var jobPosting = new JobPosting
        {
            Title = request.Title,
            Company = request.Company,
            Description = request.Description,
            Status = JobStatus.Active
        };

        _context.JobPostings.Add(jobPosting);
        await _context.SaveChangesAsync();

        var result = new JobPostingDto
        {
            Id = jobPosting.Id,
            Title = jobPosting.Title,
            Company = jobPosting.Company,
            Description = jobPosting.Description,
            DatePosted = jobPosting.DatePosted,
            Status = jobPosting.Status,
            ApplicationCount = 0,
            UserHasApplied = false
        };

        return CreatedAtAction(nameof(GetJobPosting), new { id = jobPosting.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> UpdateJobPosting(int id, UpdateJobPostingDto request)
    {
        var jobPosting = await _context.JobPostings.FindAsync(id);
        
        if (jobPosting == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrEmpty(request.Title))
            jobPosting.Title = request.Title;
        if (!string.IsNullOrEmpty(request.Company))
            jobPosting.Company = request.Company;
        if (!string.IsNullOrEmpty(request.Description))
            jobPosting.Description = request.Description;
        if (request.Status.HasValue)
            jobPosting.Status = request.Status.Value;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> DeleteJobPosting(int id)
    {
        var jobPosting = await _context.JobPostings.FindAsync(id);
        
        if (jobPosting == null)
        {
            return NotFound();
        }

        _context.JobPostings.Remove(jobPosting);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return userIdClaim != null ? int.Parse(userIdClaim) : null;
    }
}