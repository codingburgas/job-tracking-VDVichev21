using Microsoft.EntityFrameworkCore;
using Job.Application.DTOs;
using Job.Application.Services;
using Job.DataAccess;
using Job.Domain.Entities;

namespace Job.Application.Services;

public class ApplicationService : IApplicationService
{
    private readonly JobDbContext _context;

    public ApplicationService(JobDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ApplicationDto>> GetUserApplicationsAsync(int userId)
    {
        return await _context.Applications
            .Where(a => a.UserId == userId)
            .Include(a => a.User)
            .Include(a => a.JobPosting)
            .Select(a => MapToDto(a))
            .ToListAsync();
    }

    public async Task<IEnumerable<ApplicationDto>> GetJobApplicationsAsync(int jobPostingId)
    {
        return await _context.Applications
            .Where(a => a.JobPostingId == jobPostingId)
            .Include(a => a.User)
            .Include(a => a.JobPosting)
            .Select(a => MapToDto(a))
            .ToListAsync();
    }

    public async Task<IEnumerable<ApplicationDto>> GetAllApplicationsAsync()
    {
        return await _context.Applications
            .Include(a => a.User)
            .Include(a => a.JobPosting)
            .Select(a => MapToDto(a))
            .ToListAsync();
    }

    public async Task<ApplicationDto?> GetApplicationByIdAsync(int id)
    {
        var application = await _context.Applications
            .Include(a => a.User)
            .Include(a => a.JobPosting)
            .FirstOrDefaultAsync(a => a.Id == id);

        return application == null ? null : MapToDto(application);
    }

    public async Task<ApplicationDto?> CreateApplicationAsync(int userId, int jobPostingId)
    {
        // Check if user already applied
        if (await HasUserAppliedAsync(userId, jobPostingId))
            return null;

        var application = new Domain.Entities.Application
        {
            UserId = userId,
            JobPostingId = jobPostingId,
            Status = ApplicationStatus.Submitted,
            SubmittedAt = DateTime.UtcNow
        };

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();

        return await GetApplicationByIdAsync(application.Id);
    }

    public async Task<ApplicationDto?> UpdateApplicationStatusAsync(int id, UpdateApplicationStatusDto updateDto)
    {
        var application = await _context.Applications.FindAsync(id);
        if (application == null) return null;

        if (Enum.TryParse<ApplicationStatus>(updateDto.Status, out var status))
        {
            application.Status = status;
            application.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        return await GetApplicationByIdAsync(id);
    }

    public async Task<bool> HasUserAppliedAsync(int userId, int jobPostingId)
    {
        return await _context.Applications
            .AnyAsync(a => a.UserId == userId && a.JobPostingId == jobPostingId);
    }

    private ApplicationDto MapToDto(Domain.Entities.Application application)
    {
        return new ApplicationDto
        {
            Id = application.Id,
            UserId = application.UserId,
            UserName = $"{application.User.FirstName} {application.User.LastName}",
            JobPostingId = application.JobPostingId,
            JobTitle = application.JobPosting.Title,
            CompanyName = application.JobPosting.CompanyName,
            Status = application.Status.ToString(),
            SubmittedAt = application.SubmittedAt,
            UpdatedAt = application.UpdatedAt
        };
    }
}