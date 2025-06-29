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
        try
        {
            var jobs = await _context.JobPostings
                .Where(jp => jp.Status == JobStatus.Active)
                .Include(jp => jp.CreatedBy)
                .Include(jp => jp.Applications)
                .ToListAsync(); // Execute query first, then map

            return jobs.Select(MapToDto);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetActiveJobPostingsAsync: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            throw;
        }
    }

    public async Task<IEnumerable<JobPostingDto>> GetAllJobPostingsAsync()
    {
        try
        {
            var jobs = await _context.JobPostings
                .Include(jp => jp.CreatedBy)
                .Include(jp => jp.Applications)
                .ToListAsync(); // Execute query first, then map

            return jobs.Select(MapToDto);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetAllJobPostingsAsync: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            throw;
        }
    }

    public async Task<JobPostingDto?> GetJobPostingByIdAsync(int id)
    {
        try
        {
            var jobPosting = await _context.JobPostings
                .Include(jp => jp.CreatedBy)
                .Include(jp => jp.Applications)
                .FirstOrDefaultAsync(jp => jp.Id == id);

            return jobPosting == null ? null : MapToDto(jobPosting);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetJobPostingByIdAsync: {ex.Message}");
            throw;
        }
    }

    public async Task<JobPostingDto> CreateJobPostingAsync(CreateJobPostingDto createDto, int createdByUserId)
    {
        try
        {
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

            var createdJob = await GetJobPostingByIdAsync(jobPosting.Id);
            if (createdJob == null)
            {
                throw new InvalidOperationException("Failed to retrieve created job posting");
            }

            return createdJob;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in CreateJobPostingAsync: {ex.Message}");
            throw;
        }
    }

    public async Task<JobPostingDto?> UpdateJobPostingAsync(int id, UpdateJobPostingDto updateDto)
    {
        try
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
        catch (Exception ex)
        {
            Console.WriteLine($"Error in UpdateJobPostingAsync: {ex.Message}");
            throw;
        }
    }

    public async Task<bool> DeleteJobPostingAsync(int id)
    {
        try
        {
            var jobPosting = await _context.JobPostings.FindAsync(id);
            if (jobPosting == null) return false;

            _context.JobPostings.Remove(jobPosting);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in DeleteJobPostingAsync: {ex.Message}");
            throw;
        }
    }

    // Made static to avoid EF Core translation issues
    private static JobPostingDto MapToDto(JobPosting jobPosting)
    {
        try
        {
            return new JobPostingDto
            {
                Id = jobPosting.Id,
                Title = jobPosting.Title ?? string.Empty,
                CompanyName = jobPosting.CompanyName ?? string.Empty,
                Description = jobPosting.Description ?? string.Empty,
                PublishedDate = jobPosting.PublishedDate,
                Status = jobPosting.Status.ToString(),
                CreatedByName = jobPosting.CreatedBy != null 
                    ? $"{jobPosting.CreatedBy.FirstName} {jobPosting.CreatedBy.LastName}"
                    : "Unknown",
                ApplicationsCount = jobPosting.Applications?.Count ?? 0
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in MapToDto: {ex.Message}");
            Console.WriteLine($"JobPosting ID: {jobPosting?.Id}");
            Console.WriteLine($"CreatedBy is null: {jobPosting?.CreatedBy == null}");
            Console.WriteLine($"Applications is null: {jobPosting?.Applications == null}");
            throw;
        }
    }
}