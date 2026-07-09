using System.Security.Claims;
using IdentityService.Data;
using IdentityService.DTOs;
using IdentityService.Models;
using IdentityService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Controllers;

[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IdentityDbContext _db;
    private readonly TokenService _tokenService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IdentityDbContext db, TokenService tokenService, ILogger<AuthController> logger)
    {
        _db = db;
        _tokenService = tokenService;
        _logger = logger;
    }

    /// <summary>Register a new user</summary>
    /// <response code="201">User created, returns JWT token</response>
    /// <response code="400">Validation error</response>
    /// <response code="409">Email already exists</response>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), 201)]
    [ProducesResponseType(400)]
    [ProducesResponseType(409)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Email and password are required." });

        if (request.Password.Length < 6)
            return BadRequest(new { message = "Password must be at least 6 characters." });

        var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email.ToLower());
        if (existingUser is not null)
            return Conflict(new { message = "A user with this email already exists." });

        var allowedRoles = new[] { "Admin", "Reader", "Client" };
        var role = allowedRoles.Contains(request.Role) ? request.Role : "Client";

        var user = new User
        {
            Email = request.Email.ToLower().Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = role,
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim()
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var (token, expiresAt) = _tokenService.GenerateToken(user);

        _logger.LogInformation("New user registered: {Email} as {Role}", user.Email, user.Role);

        return CreatedAtAction(nameof(GetMe), new AuthResponse(
            token, user.Email, user.FirstName, user.LastName, user.Role, user.Id, expiresAt));
    }

    /// <summary>Login and receive a JWT token</summary>
    /// <response code="200">Login successful, returns JWT token</response>
    /// <response code="401">Invalid credentials</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), 200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Email and password are required." });

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email.ToLower());
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });

        var (token, expiresAt) = _tokenService.GenerateToken(user);

        _logger.LogInformation("User logged in: {Email}", user.Email);

        return Ok(new AuthResponse(
            token, user.Email, user.FirstName, user.LastName, user.Role, user.Id, expiresAt));
    }

    /// <summary>Get current authenticated user info</summary>
    /// <response code="200">Returns user info</response>
    /// <response code="401">Not authenticated</response>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserInfoResponse), 200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> GetMe()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)
            ?? User.FindFirst("sub");

        if (userIdClaim is null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized();

        var user = await _db.Users.FindAsync(userId);
        if (user is null)
            return NotFound(new { message = "User not found." });

        return Ok(new UserInfoResponse(
            user.Id, user.Email, user.FirstName, user.LastName, user.Role, user.CreatedAt));
    }
}
