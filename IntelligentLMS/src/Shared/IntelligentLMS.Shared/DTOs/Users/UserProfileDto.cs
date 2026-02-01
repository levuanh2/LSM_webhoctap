namespace IntelligentLMS.Shared.DTOs.Users;

public class UserProfileDto
{
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public string? PhoneNumber { get; set; }
}
