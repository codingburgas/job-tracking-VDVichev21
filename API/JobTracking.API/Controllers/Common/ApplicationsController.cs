using JobTracking.Application.Services;
using JobTracking.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JobTracking.API.Controllers.Common;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Only require authentication, no role restrictions
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
            Console.WriteLine($"🔄 Get my applications request received");
            
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                Console.WriteLine("❌ User ID claim not found in token");
                return Unauthorized("User ID not found in token");
            }

            var userId = int.Parse(userIdClaim.Value);
            Console.WriteLine($"✅ User ID extracted from token: {userId}");
            
            var applications = await _applicationService.GetUserApplicationsAsync(userId);
            Console.WriteLine($"✅ Retrieved {applications.Count} applications for user");
            
            return Ok(applications);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error getting user applications: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("received")]
    public async Task<IActionResult> GetReceivedApplications()
    {
        try
        {
            Console.WriteLine($"🔄 Get received applications request received");
            
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                Console.WriteLine("❌ User ID claim not found in token");
                return Unauthorized("User ID not found in token");
            }

            var userId = int.Parse(userIdClaim.Value);
            Console.WriteLine($"✅ User ID extracted from token: {userId}");
            
            var applications = await _applicationService.GetApplicationsForUserJobsAsync(userId);
            Console.WriteLine($"✅ Retrieved {applications.Count} received applications for user");
            
            return Ok(applications);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error getting received applications: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateApplicationStatus(int id, [FromBody] ApplicationStatus status)
    {
        try
        {
            Console.WriteLine($"🔄 Update application status request received for ID: {id}, Status: {status}");
            
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                Console.WriteLine("❌ User ID claim not found in token");
                return Unauthorized("User ID not found in token");
            }

            var userId = int.Parse(userIdClaim.Value);
            Console.WriteLine($"✅ User ID extracted from token: {userId}");
            
            // Check if user owns the job posting for this application
            var application = await _applicationService.GetApplicationByIdAsync(id);
            if (application == null)
            {
                Console.WriteLine($"❌ Application not found");
                return NotFound("Application not found");
            }
                
            var jobPosting = await _jobPostingService.GetJobPostingByIdAsync(application.JobPostingId, userId);
            if (jobPosting?.PostedByUserId != userId)
            {
                Console.WriteLine($"❌ User doesn't own the job posting for this application");
                return Forbid("You can only update status for applications to your own job postings");
            }
            
            var success = await _applicationService.UpdateApplicationStatusAsync(id, status);
            if (!success)
            {
                Console.WriteLine($"❌ Failed to update application status");
                return NotFound();
            }

            Console.WriteLine($"✅ Application status updated successfully");
            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error updating application status: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }
    }
}