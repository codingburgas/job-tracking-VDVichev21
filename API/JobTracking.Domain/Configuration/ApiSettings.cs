namespace JobTracking.Domain.Configuration;

public class ApiSettings
{
    public const string SectionName = "ApiSettings";
    
    public string BaseUrl { get; set; } = string.Empty;
    public string[] AllowedOrigins { get; set; } = Array.Empty<string>();
}