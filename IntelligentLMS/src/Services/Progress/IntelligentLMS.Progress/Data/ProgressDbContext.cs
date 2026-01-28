using Microsoft.EntityFrameworkCore;
using IntelligentLMS.Progress.Entities;

namespace IntelligentLMS.Progress.Data;

public class ProgressDbContext : DbContext
{
    public ProgressDbContext(DbContextOptions<ProgressDbContext> options) : base(options) { }

    public DbSet<Enrollment> Enrollments { get; set; }
    public DbSet<LessonProgress> LessonProgresses { get; set; }
}
