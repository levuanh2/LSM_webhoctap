using Microsoft.EntityFrameworkCore;
using IntelligentLMS.User.Entities;

namespace IntelligentLMS.User.Data;

public class UserDbContext : DbContext
{
    public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

    public DbSet<UserProfile> UserProfiles { get; set; }
}
