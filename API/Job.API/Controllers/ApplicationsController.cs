using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Job.Application.DTOs;
using Job.Application.Services;

namespace Job.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _applicationService;

    public ApplicationsController(IApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetApplications()
    {
        if (User.IsInRole("Admin"))
        {
            var allApplications = await _applicationService.GetAllApplicationsAsync();
            return Ok(allApplications);
        }
        else
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userApplications = await _applicationService.GetUserApplicationsAsync(userId);
            return Ok(userApplications);
        }
    }

    [HttpGet("job/{jobPostingId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetJobApplications(int jobPostingId)
    {
        var applications = await _applicationService.GetJobApplicationsAsync(jobPostingId);
        return Ok(applications);
    }

    [HttpPost("apply/{jobPostingId}")]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<ApplicationDto>> ApplyForJob(int jobPostingId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var result = await _applicationService.CreateApplicationAsync(userId, jobPostingId);
        
        if (result == null)
            return BadRequest("You have already applied for this job");

        return Ok(result);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApplicationDto>> UpdateApplicationStatus(int id, [FromBody] UpdateApplicationStatusDto updateDto)
    {
        var result = await _applicationService.UpdateApplicationStatusAsync(id, updateDto);
        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpGet("check/{jobPostingId}")]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<bool>> CheckIfApplied(int jobPostingId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var hasApplied = await _applicationService.HasUserAppliedAsync(userId, jobPostingId);
        return Ok(hasApplied);
    }
}