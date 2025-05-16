﻿using System.ComponentModel.DataAnnotations;
using JobTracking.DataAccess.Data.Base;
using JobTracking.Domain.Enums;

namespace JobTracking.DataAccess.Data.Models;

public class JobApplication : IEntity
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public int JobAdId { get; set; }

    [Required]
    public ApplicationStatusEnum Status { get; set; }

    public bool IsActive { get; set; }
    public DateTime CreatedOn { get; set; }
    public string CreatedBy { get; set; }
    public DateTime? UpdatedOn { get; set; }
    public string? UpdatedBy { get; set; }

    public virtual User User { get; set; }
    public virtual JobAd JobAd { get; set; }
}