using JobTracking.DataAccess.Data;
using JobTracking.DataAccess.Data.Base;
using JobTracking.Domain.DTOs;
using JobTracking.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace JobTracking.Application.Services;

public class ApplicationService
{
    private readonly JobTrackingDbContext _context;

    public ApplicationService(JobTrackingDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ApplyForJobAsync(int jobPostingId, int userId, IFormFile? resumeFile = null)
    {
        var existingApplication = await _context.Applications
            .FirstOrDefaultAsync(a => a.JobPostingId == jobPostingId && a.UserId == userId);

        if (existingApplication != null) return false;

        var jobPosting = await _context.JobPostings.FindAsync(jobPostingId);
        if (jobPosting == null || jobPosting.Status != JobStatus.Active) return false;

        if (jobPosting.PostedByUserId == userId) return false;

        var application = new DataAccess.Data.Base.Application
        {
            JobPostingId = jobPostingId,
            UserId = userId,
            Status = ApplicationStatus.Submitted,
            DateApplied = DateTime.UtcNow
        };

        if (resumeFile != null)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "resumes");
            Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{userId}_{jobPostingId}_{Guid.NewGuid()}.pdf";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await resumeFile.CopyToAsync(fileStream);
            }

            application.ResumeFileName = resumeFile.FileName;
            application.ResumeFilePath = filePath;
        }

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<ApplicationDto>> GetUserApplicationsAsync(int userId)
    {
        return await _context.Applications
            .Include(a => a.JobPosting)
            .Include(a => a.User)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.DateApplied)
            .Select(a => new ApplicationDto
            {
                Id = a.Id,
                JobPostingId = a.JobPostingId,
                JobTitle = a.JobPosting.Title,
                CompanyName = a.JobPosting.CompanyName,
                UserId = a.UserId,
                UserName = a.User.FirstName + " " + a.User.LastName,
                Status = a.Status,
                DateApplied = a.DateApplied,
                ResumeFileName = a.ResumeFileName,
                ResumeFilePath = a.ResumeFilePath
            })
            .ToListAsync();
    }

    public async Task<List<ApplicationDto>> GetApplicationsForUserJobsAsync(int userId)
    {
        return await _context.Applications
            .Include(a => a.JobPosting)
            .Include(a => a.User)
            .Where(a => a.JobPosting.PostedByUserId == userId)
            .OrderByDescending(a => a.DateApplied)
            .Select(a => new ApplicationDto
            {
                Id = a.Id,
                JobPostingId = a.JobPostingId,
                JobTitle = a.JobPosting.Title,
                CompanyName = a.JobPosting.CompanyName,
                UserId = a.UserId,
                UserName = a.User.FirstName + " " + a.User.LastName,
                Status = a.Status,
                DateApplied = a.DateApplied,
                ResumeFileName = a.ResumeFileName,
                ResumeFilePath = a.ResumeFilePath
            })
            .ToListAsync();
    }

    public async Task<List<ApplicationDto>> GetApplicationsForJobAsync(int jobPostingId)
    {
        return await _context.Applications
            .Include(a => a.JobPosting)
            .Include(a => a.User)
            .Where(a => a.JobPostingId == jobPostingId)
            .OrderByDescending(a => a.DateApplied)
            .Select(a => new ApplicationDto
            {
                Id = a.Id,
                JobPostingId = a.JobPostingId,
                JobTitle = a.JobPosting.Title,
                CompanyName = a.JobPosting.CompanyName,
                UserId = a.UserId,
                UserName = a.User.FirstName + " " + a.User.LastName,
                Status = a.Status,
                DateApplied = a.DateApplied,
                ResumeFileName = a.ResumeFileName,
                ResumeFilePath = a.ResumeFilePath
            })
            .ToListAsync();
    }

    public async Task<ApplicationDto?> GetApplicationByIdAsync(int applicationId)
    {
        return await _context.Applications
            .Include(a => a.JobPosting)
            .Include(a => a.User)
            .Where(a => a.Id == applicationId)
            .Select(a => new ApplicationDto
            {
                Id = a.Id,
                JobPostingId = a.JobPostingId,
                JobTitle = a.JobPosting.Title,
                CompanyName = a.JobPosting.CompanyName,
                UserId = a.UserId,
                UserName = a.User.FirstName + " " + a.User.LastName,
                Status = a.Status,
                DateApplied = a.DateApplied,
                ResumeFileName = a.ResumeFileName,
                ResumeFilePath = a.ResumeFilePath
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> UpdateApplicationStatusAsync(int applicationId, ApplicationStatus status)
    {
        var application = await _context.Applications.FindAsync(applicationId);
        if (application == null) return false;

        application.Status = status;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<string?> GetResumeFilePathAsync(int applicationId)
    {
        var application = await _context.Applications.FindAsync(applicationId);
        return application?.ResumeFilePath;
    }
}