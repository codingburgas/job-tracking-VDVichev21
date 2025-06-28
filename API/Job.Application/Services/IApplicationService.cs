using Job.Application.DTOs;

namespace Job.Application.Services;

public interface IApplicationService
{
    Task<IEnumerable<ApplicationDto>> GetUserApplicationsAsync(int userId);
    Task<IEnumerable<ApplicationDto>> GetJobApplicationsAsync(int jobPostingId);
    Task<IEnumerable<ApplicationDto>> GetAllApplicationsAsync();
    Task<ApplicationDto?> GetApplicationByIdAsync(int id);
    Task<ApplicationDto?> CreateApplicationAsync(int userId, int jobPostingId);
    Task<ApplicationDto?> UpdateApplicationStatusAsync(int id, UpdateApplicationStatusDto updateDto);
    Task<bool> HasUserAppliedAsync(int userId, int jobPostingId);
}