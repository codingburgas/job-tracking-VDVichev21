using JobTracking.Domain.Enums;

namespace JobTracking.DataAccess.Data.Base;

public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string? MiddleName { get; set; }
    public string LastName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; }

    public ICollection<Application> Applications { get; set; } = new List<Application>();
}