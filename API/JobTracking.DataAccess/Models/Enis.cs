using System.ComponentModel.DataAnnotations;
using JobTracking.DataAccess.Data.Base;

namespace JobTracking.DataAccess.Models;

public class Enis :IEntity
{
    [Key]
    public int Id { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedOn { get; set; }
    [MaxLength(20)]
    public string CreatedBy { get; set; }
    public DateTime? UpdatedOn { get; set; }
    public string? UpdatedBy { get; set; }
   public virtual ICollection<Enis> enis { get; set; } = new List<Enis>();
    
}