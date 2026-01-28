using IntelligentLMS.Progress.Data;
using IntelligentLMS.Progress.Entities;
using IntelligentLMS.Progress.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IntelligentLMS.Progress.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProgressController : ControllerBase
{
    private readonly ProgressDbContext _context;
    private readonly IAiAdvisorClient _aiClient;

    public ProgressController(ProgressDbContext context, IAiAdvisorClient aiClient)
    {
        _context = context;
        _aiClient = aiClient;
    }

    [HttpPost("enroll")]
    public async Task<IActionResult> Enroll([FromBody] Enrollment enrollment)
    {
        if (await _context.Enrollments.AnyAsync(e => e.UserId == enrollment.UserId && e.CourseId == enrollment.CourseId))
            return BadRequest("Already enrolled");

        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync();
        return Ok(enrollment);
    }

    [HttpPost("complete")]
    public async Task<IActionResult> CompleteLesson([FromBody] LessonProgress progress)
    {
        var existing = await _context.LessonProgresses
            .FirstOrDefaultAsync(p => p.UserId == progress.UserId && p.LessonId == progress.LessonId);

        if (existing == null)
        {
            progress.IsCompleted = true;
            progress.CompletedAt = DateTime.UtcNow;
            _context.LessonProgresses.Add(progress);
        }
        else
        {
            existing.IsCompleted = true;
            existing.CompletedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return Ok(progress);
    }

    [HttpGet("{userId}/recommendation")]
    public async Task<IActionResult> GetRecommendation(Guid userId)
    {
        // Calculate average progress
        var totalEnrolled = await _context.Enrollments.CountAsync(e => e.UserId == userId);
        double progress = 0; 
        
        // Simplified Logic: just mock progress percentage
        if (totalEnrolled > 0) progress = 45.0; 

        var recommendation = await _aiClient.GetRecommendationAsync(userId, progress);
        return Ok(new { recommendation });
    }
}
