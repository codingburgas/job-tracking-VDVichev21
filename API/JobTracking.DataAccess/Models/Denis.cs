using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using JobTracking.DataAccess.Data.Base;

namespace JobTracking.DataAccess.Models;

public class Denis : IEntity
{
 [Key]
 public int Id { get; set; }
 public bool IsActive { get; set; }
 public DateTime CreatedOn { get; set; }
 
 [Required]
 public string CreatedBy { get; set; }
 public DateTime? UpdatedOn { get; set; }
 public string? UpdatedBy { get; set; }
 public string Name { get; set; }
 public string Description { get; set; }
 public DateTime StartDate { get; set; }
 
 [Required]
 public int EnisID { get; set; }
 public virtual Enis enis { get; set; }
 
}