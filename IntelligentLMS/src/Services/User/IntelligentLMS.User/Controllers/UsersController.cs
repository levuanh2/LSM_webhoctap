using IntelligentLMS.User.Data;
using IntelligentLMS.User.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IntelligentLMS.User.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserDbContext _context;

    public UsersController(UserDbContext context)
    {
        _context = context;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProfile(Guid id)
    {
        var profile = await _context.UserProfiles.FindAsync(id);
        if (profile == null) return NotFound();
        return Ok(profile);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProfile(Guid id, [FromBody] UserProfile model)
    {
        var profile = await _context.UserProfiles.FindAsync(id);
        if (profile == null)
        {
            profile = new UserProfile { UserId = id };
            _context.UserProfiles.Add(profile);
        }

        profile.FullName = model.FullName;
        profile.Bio = model.Bio;
        profile.AvatarUrl = model.AvatarUrl;
        profile.PhoneNumber = model.PhoneNumber;

        await _context.SaveChangesAsync();
        return Ok(profile);
    }
}
