using System.ComponentModel.DataAnnotations;
using JobTracking.DataAccess.Data.Base;

namespace JobTracking.DataAccess.Data.Models;

public class Example : IEntity
{
    [Key]
    public int Id { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedOn { get; set; }
    public string CreatedBy { get; set; }
    public DateTime? UpdatedOn { get; set; }
    public string? UpdatedBy { get; set; }
    
    public virtual ICollection<Model> Models { get; set; } = new List<Model>();
}