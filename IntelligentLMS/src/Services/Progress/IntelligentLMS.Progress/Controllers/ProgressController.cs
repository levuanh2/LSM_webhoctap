using IntelligentLMS.Progress.Data;
using IntelligentLMS.Progress.Entities;
using IntelligentLMS.Progress.Services;
using IntelligentLMS.Shared.DTOs.Progress;
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
    public async Task<IActionResult> Enroll([FromBody] EnrollmentDto enrollmentDto)
    {
        if (await _context.Enrollments.AnyAsync(e => e.UserId == enrollmentDto.UserId && e.CourseId == enrollmentDto.CourseId))
            return BadRequest("Already enrolled");

        var enrollment = new Enrollment
        {
            UserId = enrollmentDto.UserId,
            CourseId = enrollmentDto.CourseId,
            EnrolledAt = DateTime.UtcNow
        };

        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync();
        
        enrollmentDto.EnrolledAt = enrollment.EnrolledAt;
        
        return Ok(enrollmentDto);
    }

    [HttpPost("complete")]
    public async Task<IActionResult> CompleteLesson([FromBody] ProgressDto progressDto)
    {
        var existing = await _context.LessonProgresses
            .FirstOrDefaultAsync(p => p.UserId == progressDto.UserId && p.LessonId == progressDto.LessonId);

        if (existing == null)
        {
            var progress = new LessonProgress
            {
                UserId = progressDto.UserId,
                LessonId = progressDto.LessonId,
                IsCompleted = true,
                CompletedAt = DateTime.UtcNow
            };
            _context.LessonProgresses.Add(progress);
        }
        else
        {
            existing.IsCompleted = true;
            existing.CompletedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        
        progressDto.IsCompleted = true;
        progressDto.CompletedAt = DateTime.UtcNow;
        
        return Ok(progressDto);
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
