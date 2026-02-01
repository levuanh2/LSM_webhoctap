namespace IntelligentLMS.Shared.DTOs.Auth;

public class JwtResponse
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}
