namespace JobTracking.Domain.Constants;

public static class JwtConstants
{
    // These will be overridden by appsettings.json values
    public const string SecretKey = "fallback-secret-key-for-jwt-token-generation-minimum-256-bits";
    public const string Issuer = "JobTrackingAPI";
    public const string Audience = "JobTrackingWeb";
    public const int ExpirationHours = 24;
}