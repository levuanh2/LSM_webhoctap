namespace IntelligentLMS.Shared.DTOs;

public class CreateCourseRequest
{
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string Level { get; set; } = default!;
    public string Category { get; set; } = default!;
}
