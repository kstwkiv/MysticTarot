using System.Security.Claims;
using BookingService.Data;
using BookingService.DTOs;
using BookingService.Models;
using BookingService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookingService.Controllers;

[ApiController]
[Route("api/bookings")]
[Authorize]
[Produces("application/json")]
public class BookingsController : ControllerBase
{
    private readonly BookingDbContext _db;
    private readonly RabbitMqPublisher _publisher;
    private readonly ILogger<BookingsController> _logger;

    public BookingsController(BookingDbContext db, RabbitMqPublisher publisher, ILogger<BookingsController> logger)
    {
        _db = db;
        _publisher = publisher;
        _logger = logger;
    }

    /// <summary>Create a new booking</summary>
    /// <response code="201">Booking created</response>
    /// <response code="400">Validation error</response>
    [HttpPost]
    [ProducesResponseType(typeof(Booking), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        if (request.ScheduledAt <= DateTime.UtcNow)
            return BadRequest(new { message = "Scheduled time must be in the future." });

        var booking = new Booking
        {
            ClientId = userId,
            ClientName = request.ClientName,
            ClientEmail = request.ClientEmail,
            ReadingType = request.ReadingType,
            ScheduledAt = request.ScheduledAt,
            Notes = request.Notes
        };

        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Booking created: {Id} for client {ClientId}", booking.Id, userId);

        return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id }, booking);
    }

    /// <summary>Get all bookings — Admin and Reader only</summary>
    /// <response code="200">List of all bookings</response>
    /// <response code="403">Insufficient role</response>
    [HttpGet]
    [ProducesResponseType(typeof(List<Booking>), 200)]
    [ProducesResponseType(403)]
    public async Task<IActionResult> GetAllBookings([FromQuery] BookingStatus? status = null)
    {
        if (!IsAdminOrReader()) return Forbid();

        var query = _db.Bookings.AsQueryable();

        if (status.HasValue)
            query = query.Where(b => b.Status == status.Value);

        var bookings = await query
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return Ok(bookings);
    }

    /// <summary>Get current user's bookings</summary>
    /// <response code="200">List of user's bookings</response>
    [HttpGet("my")]
    [ProducesResponseType(typeof(List<Booking>), 200)]
    public async Task<IActionResult> GetMyBookings()
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var bookings = await _db.Bookings
            .Where(b => b.ClientId == userId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return Ok(bookings);
    }

    /// <summary>Get a booking by ID</summary>
    /// <response code="200">Booking found</response>
    /// <response code="403">Access denied</response>
    /// <response code="404">Booking not found</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(Booking), 200)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetBookingById(Guid id)
    {
        var booking = await _db.Bookings.FindAsync(id);
        if (booking is null) return NotFound(new { message = "Booking not found." });

        var userId = GetUserId();
        if (booking.ClientId != userId && !IsAdminOrReader())
            return Forbid();

        return Ok(booking);
    }

    /// <summary>Confirm a booking — Admin and Reader only</summary>
    /// <response code="200">Booking confirmed</response>
    /// <response code="400">Booking is not in Pending status</response>
    /// <response code="403">Insufficient role</response>
    /// <response code="404">Booking not found</response>
    [HttpPut("{id:guid}/confirm")]
    [ProducesResponseType(typeof(Booking), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> ConfirmBooking(Guid id)
    {
        if (!IsAdminOrReader()) return Forbid();

        var booking = await _db.Bookings.FindAsync(id);
        if (booking is null) return NotFound(new { message = "Booking not found." });

        if (booking.Status != BookingStatus.Pending)
            return BadRequest(new { message = "Only pending bookings can be confirmed." });

        booking.Status = BookingStatus.Confirmed;
        booking.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        try { _publisher.PublishBookingConfirmed(booking.Id, booking.ClientId, booking.ClientEmail, booking.ScheduledAt); }
        catch (Exception ex) { _logger.LogWarning(ex, "Failed to publish BookingConfirmed event"); }

        return Ok(booking);
    }

    /// <summary>Cancel a booking</summary>
    /// <response code="200">Booking cancelled</response>
    /// <response code="400">Completed bookings cannot be cancelled</response>
    /// <response code="403">Access denied</response>
    /// <response code="404">Booking not found</response>
    [HttpPut("{id:guid}/cancel")]
    [ProducesResponseType(typeof(Booking), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> CancelBooking(Guid id)
    {
        var booking = await _db.Bookings.FindAsync(id);
        if (booking is null) return NotFound(new { message = "Booking not found." });

        var userId = GetUserId();
        if (booking.ClientId != userId && !IsAdminOrReader())
            return Forbid();

        if (booking.Status == BookingStatus.Completed)
            return BadRequest(new { message = "Completed bookings cannot be cancelled." });

        booking.Status = BookingStatus.Cancelled;
        booking.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        try { _publisher.PublishBookingCancelled(booking.Id, booking.ClientId, booking.ClientEmail); }
        catch (Exception ex) { _logger.LogWarning(ex, "Failed to publish BookingCancelled event"); }

        return Ok(booking);
    }

    /// <summary>Mark a booking as completed — Admin and Reader only</summary>
    /// <response code="200">Booking completed</response>
    /// <response code="400">Booking must be confirmed first</response>
    /// <response code="403">Insufficient role</response>
    /// <response code="404">Booking not found</response>
    [HttpPut("{id:guid}/complete")]
    [ProducesResponseType(typeof(Booking), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> CompleteBooking(Guid id)
    {
        if (!IsAdminOrReader()) return Forbid();

        var booking = await _db.Bookings.FindAsync(id);
        if (booking is null) return NotFound(new { message = "Booking not found." });

        if (booking.Status != BookingStatus.Confirmed)
            return BadRequest(new { message = "Only confirmed bookings can be marked as completed." });

        booking.Status = BookingStatus.Completed;
        booking.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(booking);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        return claim is not null && Guid.TryParse(claim.Value, out var id) ? id : Guid.Empty;
    }

    private bool IsAdminOrReader()
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? User.FindFirst("role")?.Value;
        return role == "Admin" || role == "Reader";
    }
}
