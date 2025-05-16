using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using JobTracking.DataAccess.Data.Base;

namespace JobTracking.DataAccess.Data.Models;

public class Model : IEntity
{
    [Key]
    public int Id { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedOn { get; set; }
    
    [Required]
    public required string CreatedBy { get; set; }
    public DateTime? UpdatedOn { get; set; }
    public string? UpdatedBy { get; set; }
    
    [Required]
    public int ExampleID { get; set; }
    
    public virtual Example Example { get; set; }
}