using IntelligentLMS.Course.Data;
using IntelligentLMS.Course.Entities;
using IntelligentLMS.Shared.DTOs.Courses;
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
        var courseDtos = courses.Select(c => new CourseDto
        {
            Id = c.Id,
            Title = c.Title,
            Description = c.Description,
            Level = c.Level,
            Category = c.Category,
            InstructorId = c.InstructorId
        });
        return Ok(courseDtos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCourse(Guid id)
    {
        var course = await _context.Courses
            .Include(c => c.Lessons)
            .FirstOrDefaultAsync(c => c.Id == id);
            
        if (course == null) return NotFound();

        // Note: CourseDto doesn't currently support Lessons list, so we might lose lessons here unless we extend DTO.
        // For now adhering to strict DTO definition from request.
        // Ideally we should have CourseDetailDto.
        var courseDto = new CourseDto
        {
            Id = course.Id,
            Title = course.Title,
            Description = course.Description,
            Level = course.Level,
            Category = course.Category,
            InstructorId = course.InstructorId
        };
        return Ok(courseDto);
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

        var courseDto = new CourseDto
        {
            Id = course.Id,
            Title = course.Title,
            Description = course.Description,
            Level = course.Level,
            Category = course.Category,
            InstructorId = course.InstructorId
        };

        return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, courseDto);
    }

    [HttpPost("{courseId}/lessons")]
    public async Task<IActionResult> AddLesson(Guid courseId, [FromBody] LessonDto lessonDto)
    {
        var course = await _context.Courses.FindAsync(courseId);
        if (course == null) return NotFound("Course not found");

        var lesson = new Lesson
        {
            Title = lessonDto.Title,
            Content = lessonDto.Content,
            CourseId = courseId,
            Order = lessonDto.Order
        };

        _context.Lessons.Add(lesson);
        await _context.SaveChangesAsync();
        
        lessonDto.Id = lesson.Id;

        return Ok(lessonDto);
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
