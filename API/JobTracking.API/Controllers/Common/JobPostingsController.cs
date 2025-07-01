using JobTracking.Application.Services;
using JobTracking.Domain.DTOs;
using JobTracking.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JobTracking.API.Controllers 
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobPostingsController : ControllerBase
    {
        private readonly JobPostingService _jobPostingService;
        private readonly ApplicationService _applicationService;

        public JobPostingsController(JobPostingService jobPostingService, ApplicationService applicationService)
        {
            _jobPostingService = jobPostingService;
            _applicationService = applicationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetJobPostings()
        {
            var currentUserId = User.Identity?.IsAuthenticated == true 
                ? int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value) 
                : (int?)null;

            var jobPostings = await _jobPostingService.GetActiveJobPostingsAsync(currentUserId);
            return Ok(jobPostings);
        }

        [HttpGet("all")]
        [Authorize]
        public async Task<IActionResult> GetAllJobPostings()
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var jobPostings = await _jobPostingService.GetAllJobPostingsAsync(currentUserId);
            return Ok(jobPostings);
        }

        [HttpGet("my")]
        [Authorize]
        public async Task<IActionResult> GetMyJobPostings()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var jobPostings = await _jobPostingService.GetMyJobPostingsAsync(userId);
            return Ok(jobPostings);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetJobPosting(int id)
        {
            var currentUserId = User.Identity?.IsAuthenticated == true 
                ? int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value) 
                : (int?)null;

            var jobPosting = await _jobPostingService.GetJobPostingByIdAsync(id, currentUserId);
            if (jobPosting == null) return NotFound();
            return Ok(jobPosting);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateJobPosting([FromBody] CreateJobPostingDto createDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var jobPosting = await _jobPostingService.CreateJobPostingAsync(createDto, userId);
            return CreatedAtAction(nameof(GetJobPosting), new { id = jobPosting.Id }, jobPosting);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateJobPosting(int id, [FromBody] CreateJobPostingDto updateDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var success = await _jobPostingService.UpdateJobPostingAsync(id, updateDto, userId);
            if (!success) return NotFound("Not found or no permission");
            return NoContent();
        }

        [HttpPut("{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateJobPostingStatus(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var status = JobStatus.Active;
            var success = await _jobPostingService.UpdateJobPostingStatusAsync(id, status, userId);
            if (!success) return NotFound("Not found or no permission");
            return NoContent();
        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteJobPosting(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var success = await _jobPostingService.DeleteJobPostingAsync(id, userId);
            if (!success) return NotFound("Not found or no permission");
            return NoContent();
        }

        [HttpPost("{id}/apply")]
        [Authorize]
        public async Task<IActionResult> ApplyForJob(int id, IFormFile? resumeFile)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var jobPosting = await _jobPostingService.GetJobPostingByIdAsync(id, userId);
            if (jobPosting?.PostedByUserId == userId) return BadRequest("You cannot apply to your own job posting");

            if (resumeFile != null)
            {
                if (resumeFile.ContentType != "application/pdf") return BadRequest("Only PDF files are allowed");
                if (resumeFile.Length > 5 * 1024 * 1024) return BadRequest("File size cannot exceed 5MB");
            }

            var success = await _applicationService.ApplyForJobAsync(id, userId, resumeFile);
            if (!success) return BadRequest("Already applied or job not active");

            return Ok();
        }

        [HttpGet("{id}/applications")]
        [Authorize]
        public async Task<IActionResult> GetJobApplications(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var jobPosting = await _jobPostingService.GetJobPostingByIdAsync(id, userId);
            if (jobPosting?.PostedByUserId != userId) return Forbid("Only owner can view applications");

            var applications = await _applicationService.GetApplicationsForJobAsync(id);
            return Ok(applications);
        }

        [HttpGet("applications/{applicationId}/resume")]
        [Authorize]
        public async Task<IActionResult> DownloadResume(int applicationId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var application = await _applicationService.GetApplicationByIdAsync(applicationId);
            if (application == null) return NotFound("Application not found");

            var jobPosting = await _jobPostingService.GetJobPostingByIdAsync(application.JobPostingId, userId);
            if (jobPosting?.PostedByUserId != userId) return Forbid("Only owner can download resumes");

            var filePath = await _applicationService.GetResumeFilePathAsync(applicationId);
            if (string.IsNullOrEmpty(filePath) || !System.IO.File.Exists(filePath)) return NotFound("Resume not found");

            var fileName = Path.GetFileName(filePath);
            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            return File(fileBytes, "application/pdf", fileName);
        }
    }
}
