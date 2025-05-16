using System.ComponentModel.DataAnnotations;
using JobTracking.DataAccess.Data.Base;

namespace JobTracking.DataAccess.Data.Models;

public class JobAd : IEntity
{
    [Key]
    public int Id { get; set; }

    [Required, StringLength(128)]
    public string Title { get; set; }

    [Required, StringLength(128)]
    public string CompanyName { get; set; }

    [Required, StringLength(1024)]
    public string Description { get; set; }

    public DateTime PublishedOn { get; set; }

    public bool IsOpen { get; set; }

    public bool IsActive { get; set; }
    public DateTime CreatedOn { get; set; }
    public string CreatedBy { get; set; }
    public DateTime? UpdatedOn { get; set; }
    public string? UpdatedBy { get; set; }

    public virtual ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
}