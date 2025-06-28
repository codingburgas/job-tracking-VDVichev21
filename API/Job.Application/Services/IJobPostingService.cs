using Job.Application.DTOs;

namespace Job.Application.Services;

public interface IJobPostingService
{
    Task<IEnumerable<JobPostingDto>> GetActiveJobPostingsAsync();
    Task<IEnumerable<JobPostingDto>> GetAllJobPostingsAsync();
    Task<JobPostingDto?> GetJobPostingByIdAsync(int id);
    Task<JobPostingDto> CreateJobPostingAsync(CreateJobPostingDto createDto, int createdByUserId);
    Task<JobPostingDto?> UpdateJobPostingAsync(int id, UpdateJobPostingDto updateDto);
    Task<bool> DeleteJobPostingAsync(int id);
}