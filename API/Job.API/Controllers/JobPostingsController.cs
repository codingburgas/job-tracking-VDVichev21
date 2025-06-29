using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Job.Application.DTOs;
using Job.Application.Services;

namespace Job.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobPostingsController : ControllerBase
{
    private readonly IJobPostingService _jobPostingService;
    private readonly ILogger<JobPostingsController> _logger;

    public JobPostingsController(IJobPostingService jobPostingService, ILogger<JobPostingsController> logger)
    {
        _jobPostingService = jobPostingService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<JobPostingDto>>> GetJobPostings()
    {
        try
        {
            _logger.LogInformation("Getting job postings. User authenticated: {IsAuthenticated}", User.Identity?.IsAuthenticated ?? false);
            
            if (User.Identity?.IsAuthenticated == true && User.IsInRole("Admin User"))
            {
                _logger.LogInformation("Returning all job postings for admin user");
                var allJobPostings = await _jobPostingService.GetAllJobPostingsAsync();
                _logger.LogInformation("Successfully retrieved {Count} job postings for admin", allJobPostings.Count());
                return Ok(allJobPostings);
            }
            else
            {
                _logger.LogInformation("Returning active job postings for non-admin user");
                var activeJobPostings = await _jobPostingService.GetActiveJobPostingsAsync();
                _logger.LogInformation("Successfully retrieved {Count} active job postings", activeJobPostings.Count());
                return Ok(activeJobPostings);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting job postings");
            return StatusCode(500, new { 
                message = "An error occurred while retrieving job postings", 
                error = ex.Message,
                stackTrace = ex.StackTrace
            });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<JobPostingDto>> GetJobPosting(int id)
    {
        try
        {
            _logger.LogInformation("Getting job posting with ID: {Id}", id);
            var jobPosting = await _jobPostingService.GetJobPostingByIdAsync(id);
            if (jobPosting == null)
            {
                _logger.LogWarning("Job posting with ID {Id} not found", id);
                return NotFound();
            }

            _logger.LogInformation("Successfully retrieved job posting with ID: {Id}", id);
            return Ok(jobPosting);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting job posting with ID: {Id}", id);
            return StatusCode(500, new { 
                message = "An error occurred while retrieving the job posting", 
                error = ex.Message 
            });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<JobPostingDto>> CreateJobPosting([FromBody] CreateJobPostingDto createDto)
    {
        try
        {
            _logger.LogInformation("Creating job posting: {@JobPosting}", createDto);
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            _logger.LogInformation("User ID creating job: {UserId}", userId);
            
            var result = await _jobPostingService.CreateJobPostingAsync(createDto, userId);
            _logger.LogInformation("Job posting created successfully with ID: {Id}", result.Id);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating job posting: {@JobPosting}", createDto);
            return StatusCode(500, new { 
                message = "An error occurred while creating the job posting", 
                error = ex.Message 
            });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<JobPostingDto>> UpdateJobPosting(int id, [FromBody] UpdateJobPostingDto updateDto)
    {
        try
        {
            _logger.LogInformation("Updating job posting with ID: {Id}, Data: {@UpdateData}", id, updateDto);
            var result = await _jobPostingService.UpdateJobPostingAsync(id, updateDto);
            if (result == null)
            {
                _logger.LogWarning("Job posting with ID {Id} not found for update", id);
                return NotFound();
            }

            _logger.LogInformation("Job posting updated successfully: {Id}", id);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating job posting with ID: {Id}", id);
            return StatusCode(500, new { 
                message = "An error occurred while updating the job posting", 
                error = ex.Message 
            });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteJobPosting(int id)
    {
        try
        {
            _logger.LogInformation("Deleting job posting with ID: {Id}", id);
            var result = await _jobPostingService.DeleteJobPostingAsync(id);
            if (!result)
            {
                _logger.LogWarning("Job posting with ID {Id} not found for deletion", id);
                return NotFound();
            }

            _logger.LogInformation("Job posting deleted successfully: {Id}", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting job posting with ID: {Id}", id);
            return StatusCode(500, new { 
                message = "An error occurred while deleting the job posting", 
                error = ex.Message 
            });
        }
    }
}