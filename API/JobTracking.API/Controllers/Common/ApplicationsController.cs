using JobTracking.Application.Services;
using JobTracking.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JobTracking.API.Controllers.Common;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly ApplicationService _applicationService;
    private readonly JobPostingService _jobPostingService;

    public ApplicationsController(ApplicationService applicationService, JobPostingService jobPostingService)
    {
        _applicationService = applicationService;
        _jobPostingService = jobPostingService;
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyApplications()
    {
        try
        {
            
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token");
            }

            var userId = int.Parse(userIdClaim.Value);
            
            var applications = await _applicationService.GetUserApplicationsAsync(userId);
            
            return Ok(applications);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("received")]
    public async Task<IActionResult> GetReceivedApplications()
    {
        try
        {
            
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token");
            }

            var userId = int.Parse(userIdClaim.Value);
            
            var applications = await _applicationService.GetApplicationsForUserJobsAsync(userId);
            
            return Ok(applications);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateApplicationStatus(int id, [FromBody] ApplicationStatus status)
    {
        try
        {
            
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token");
            }

            var userId = int.Parse(userIdClaim.Value);
            
            
            var application = await _applicationService.GetApplicationByIdAsync(id);
            if (application == null)
            {
                return NotFound("Application not found");
            }
                
            var jobPosting = await _jobPostingService.GetJobPostingByIdAsync(application.JobPostingId, userId);
            if (jobPosting?.PostedByUserId != userId)
            {
                return Forbid("You can only update status for applications to your own job postings");
            }
            
            var success = await _applicationService.UpdateApplicationStatusAsync(id, status);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error");
        }
    }
}