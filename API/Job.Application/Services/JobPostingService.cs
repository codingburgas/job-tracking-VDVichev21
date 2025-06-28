using Microsoft.EntityFrameworkCore;
using Job.Application.DTOs;
using Job.Application.Services;
using Job.DataAccess;
using Job.Domain.Entities;

namespace Job.Application.Services;

public class JobPostingService : IJobPostingService
{
    private readonly JobDbContext _context;

    public JobPostingService(JobDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<JobPostingDto>> GetActiveJobPostingsAsync()
    {
        var jobs = await _context.JobPostings
            .Where(jp => jp.Status == JobStatus.Active)
            .Include(jp => jp.CreatedBy)
            .Include(jp => jp.Applications)
            .Select(jp => MapToDto(jp))
            .ToListAsync();

        Console.WriteLine($"GetActiveJobPostingsAsync: Found {jobs.Count()} active jobs");
        return jobs;
    }

    public async Task<IEnumerable<JobPostingDto>> GetAllJobPostingsAsync()
    {
        var jobs = await _context.JobPostings
            .Include(jp => jp.CreatedBy)
            .Include(jp => jp.Applications)
            .Select(jp => MapToDto(jp))
            .ToListAsync();

        Console.WriteLine($"GetAllJobPostingsAsync: Found {jobs.Count()} total jobs");
        return jobs;
    }

    public async Task<JobPostingDto?> GetJobPostingByIdAsync(int id)
    {
        var jobPosting = await _context.JobPostings
            .Include(jp => jp.CreatedBy)
            .Include(jp => jp.Applications)
            .FirstOrDefaultAsync(jp => jp.Id == id);

        return jobPosting == null ? null : MapToDto(jobPosting);
    }

    public async Task<JobPostingDto> CreateJobPostingAsync(CreateJobPostingDto createDto, int createdByUserId)
    {
        Console.WriteLine($"Creating job posting: {createDto.Title} for user {createdByUserId}");
        
        var jobPosting = new JobPosting
        {
            Title = createDto.Title,
            CompanyName = createDto.CompanyName,
            Description = createDto.Description,
            CreatedByUserId = createdByUserId,
            PublishedDate = DateTime.UtcNow,
            Status = JobStatus.Active
        };

        _context.JobPostings.Add(jobPosting);
        await _context.SaveChangesAsync();

        Console.WriteLine($"Job posting created with ID: {jobPosting.Id}");

        // Reload the job posting with all related data
        var createdJob = await GetJobPostingByIdAsync(jobPosting.Id);
        if (createdJob == null)
        {
            throw new InvalidOperationException("Failed to retrieve created job posting");
        }

        Console.WriteLine($"Returning created job: {createdJob.Title} (ID: {createdJob.Id})");
        return createdJob;
    }

    public async Task<JobPostingDto?> UpdateJobPostingAsync(int id, UpdateJobPostingDto updateDto)
    {
        var jobPosting = await _context.JobPostings.FindAsync(id);
        if (jobPosting == null) return null;

        jobPosting.Title = updateDto.Title;
        jobPosting.CompanyName = updateDto.CompanyName;
        jobPosting.Description = updateDto.Description;
        
        if (Enum.TryParse<JobStatus>(updateDto.Status, out var status))
            jobPosting.Status = status;

        await _context.SaveChangesAsync();
        return await GetJobPostingByIdAsync(id);
    }

    public async Task<bool> DeleteJobPostingAsync(int id)
    {
        var jobPosting = await _context.JobPostings.FindAsync(id);
        if (jobPosting == null) return false;

        _context.JobPostings.Remove(jobPosting);
        await _context.SaveChangesAsync();
        return true;
    }

    private JobPostingDto MapToDto(JobPosting jobPosting)
    {
        return new JobPostingDto
        {
            Id = jobPosting.Id,
            Title = jobPosting.Title,
            CompanyName = jobPosting.CompanyName,
            Description = jobPosting.Description,
            PublishedDate = jobPosting.PublishedDate,
            Status = jobPosting.Status.ToString(),
            CreatedByName = $"{jobPosting.CreatedBy.FirstName} {jobPosting.CreatedBy.LastName}",
            ApplicationsCount = jobPosting.Applications.Count
        };
    }
}