using IntelligentLMS.Course.Data;
using IntelligentLMS.Course.Entities;
using IntelligentLMS.Shared.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IntelligentLMS.Course.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly CourseDbContext _context;

    public CoursesController(CourseDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCourses()
    {
        var courses = await _context.Courses.ToListAsync();
        return Ok(courses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCourse(Guid id)
    {
        var course = await _context.Courses
            .Include(c => c.Lessons)
            .FirstOrDefaultAsync(c => c.Id == id);
            
        if (course == null) return NotFound();
        return Ok(course);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCourse([FromBody] CreateCourseRequest request)
    {
        // In a real app, get InstructorId from JWT claims
        var course = new Entities.Course
        {
            Title = request.Title,
            Description = request.Description,
            Level = request.Level,
            Category = request.Category,
            InstructorId = Guid.NewGuid() // Placeholder
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, course);
    }

    [HttpPost("{courseId}/lessons")]
    public async Task<IActionResult> AddLesson(Guid courseId, [FromBody] Lesson lesson)
    {
        var course = await _context.Courses.FindAsync(courseId);
        if (course == null) return NotFound("Course not found");

        lesson.CourseId = courseId;
        _context.Lessons.Add(lesson);
        await _context.SaveChangesAsync();

        return Ok(lesson);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourse(Guid id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null) return NotFound();

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
