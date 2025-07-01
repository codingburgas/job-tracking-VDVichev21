using JobTracking.DataAccess.Data;
using JobTracking.DataAccess.Data.Base;
using JobTracking.Domain.DTOs;
using JobTracking.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace JobTracking.Application.Services;

public class JobPostingService
{
    private readonly JobTrackingDbContext _context;

    public JobPostingService(JobTrackingDbContext context)
    {
        _context = context;
    }

    public async Task<List<JobPostingDto>> GetActiveJobPostingsAsync(int? currentUserId = null)
    {
        return await _context.JobPostings
            .Include(j => j.PostedByUser)
            .Where(j => j.Status == JobStatus.Active)
            .OrderByDescending(j => j.DatePosted)
            .Select(j => new JobPostingDto
            {
                Id = j.Id,
                Title = j.Title,
                CompanyName = j.CompanyName,
                Description = j.Description,
                DatePosted = j.DatePosted,
                Status = j.Status,
                PostedByUserId = j.PostedByUserId,
                PostedByUserName = j.PostedByUser.FirstName + " " + j.PostedByUser.LastName,
                CanEdit = currentUserId.HasValue && j.PostedByUserId == currentUserId.Value
            })
            .ToListAsync();
    }

    public async Task<List<JobPostingDto>> GetAllJobPostingsAsync(int? currentUserId = null)
    {
        return await _context.JobPostings
            .Include(j => j.PostedByUser)
            .OrderByDescending(j => j.DatePosted)
            .Select(j => new JobPostingDto
            {
                Id = j.Id,
                Title = j.Title,
                CompanyName = j.CompanyName,
                Description = j.Description,
                DatePosted = j.DatePosted,
                Status = j.Status,
                PostedByUserId = j.PostedByUserId,
                PostedByUserName = j.PostedByUser.FirstName + " " + j.PostedByUser.LastName,
                CanEdit = currentUserId.HasValue && j.PostedByUserId == currentUserId.Value
            })
            .ToListAsync();
    }

    public async Task<List<JobPostingDto>> GetMyJobPostingsAsync(int userId)
    {
        return await _context.JobPostings
            .Include(j => j.PostedByUser)
            .Where(j => j.PostedByUserId == userId)
            .OrderByDescending(j => j.DatePosted)
            .Select(j => new JobPostingDto
            {
                Id = j.Id,
                Title = j.Title,
                CompanyName = j.CompanyName,
                Description = j.Description,
                DatePosted = j.DatePosted,
                Status = j.Status,
                PostedByUserId = j.PostedByUserId,
                PostedByUserName = j.PostedByUser.FirstName + " " + j.PostedByUser.LastName,
                CanEdit = true
            })
            .ToListAsync();
    }

    public async Task<JobPostingDto?> GetJobPostingByIdAsync(int id, int? currentUserId = null)
    {
        return await _context.JobPostings
            .Include(j => j.PostedByUser)
            .Where(j => j.Id == id)
            .Where(j =>
                j.Status == JobStatus.Active ||
                (currentUserId.HasValue && j.PostedByUserId == currentUserId.Value)
            )
            .Select(j => new JobPostingDto
            {
                Id = j.Id,
                Title = j.Title,
                CompanyName = j.CompanyName,
                Description = j.Description,
                DatePosted = j.DatePosted,
                Status = j.Status,
                PostedByUserId = j.PostedByUserId,
                PostedByUserName = j.PostedByUser.FirstName + " " + j.PostedByUser.LastName,
                CanEdit = currentUserId.HasValue && j.PostedByUserId == currentUserId.Value
            })
            .FirstOrDefaultAsync();
    }


    public async Task<JobPostingDto> CreateJobPostingAsync(CreateJobPostingDto createDto, int userId)
    {
        var jobPosting = new JobPosting
        {
            Title = createDto.Title,
            CompanyName = createDto.CompanyName,
            Description = createDto.Description,
            DatePosted = DateTime.UtcNow,
            Status = JobStatus.Active,
            PostedByUserId = userId
        };

        _context.JobPostings.Add(jobPosting);
        await _context.SaveChangesAsync();

        // Load the user information
        var user = await _context.Users.FindAsync(userId);

        return new JobPostingDto
        {
            Id = jobPosting.Id,
            Title = jobPosting.Title,
            CompanyName = jobPosting.CompanyName,
            Description = jobPosting.Description,
            DatePosted = jobPosting.DatePosted,
            Status = jobPosting.Status,
            PostedByUserId = jobPosting.PostedByUserId,
            PostedByUserName = user?.FirstName + " " + user?.LastName ?? "Unknown",
            CanEdit = true
        };
    }

    public async Task<bool> UpdateJobPostingAsync(int id, CreateJobPostingDto updateDto, int userId)
    {
        var jobPosting = await _context.JobPostings.FindAsync(id);
        if (jobPosting == null || jobPosting.PostedByUserId != userId) 
            return false;

        jobPosting.Title = updateDto.Title;
        jobPosting.CompanyName = updateDto.CompanyName;
        jobPosting.Description = updateDto.Description;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateJobPostingStatusAsync(int id, JobStatus status, int userId)
    {
        var jobPosting = await _context.JobPostings.FindAsync(id);
        if (jobPosting == null || jobPosting.PostedByUserId != userId) 
            return false;

        jobPosting.Status = status;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteJobPostingAsync(int id, int userId)
    {
        var jobPosting = await _context.JobPostings.FindAsync(id);
        if (jobPosting == null || jobPosting.PostedByUserId != userId) 
            return false;

        _context.JobPostings.Remove(jobPosting);
        await _context.SaveChangesAsync();
        return true;
    }
}