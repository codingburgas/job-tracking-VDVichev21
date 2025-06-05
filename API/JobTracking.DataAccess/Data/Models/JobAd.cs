public class JobAd : IEntity
{
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime Deadline { get; set; }
    public ICollection<JobApplication> Applications { get; set; }
}