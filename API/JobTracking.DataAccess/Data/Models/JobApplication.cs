public class JobApplication : IEntity
{
    public Guid UserId { get; set; }
    public Guid JobAdId { get; set; }
    public string CoverLetter { get; set; }
    public ApplicationStatusEnum Status { get; set; }
}