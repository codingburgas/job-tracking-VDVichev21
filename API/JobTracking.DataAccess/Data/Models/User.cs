using System.ComponentModel.DataAnnotations;
using JobTracking.DataAccess.Data.Base;
using JobTracking.Domain.Enums;

namespace JobTracking.DataAccess.Data.Models;

public class User : IEntity
{
    [Key]
    public int Id { get; set; }

    [Required, StringLength(64)]
    public string FirstName { get; set; }

    [Required, StringLength(64)]
    public string MiddleName { get; set; }

    [Required, StringLength(64)]
    public string LastName { get; set; }

    [Required, StringLength(32)]
    public string Username { get; set; }

    [Required, StringLength(128)]
    public string Password { get; set; }

    [Required]
    public UserRoleEnum Role { get; set; }

    public bool IsActive { get; set; }
    public DateTime CreatedOn { get; set; }
    public string CreatedBy { get; set; }
    public DateTime? UpdatedOn { get; set; }
    public string? UpdatedBy { get; set; }

    public virtual ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
}