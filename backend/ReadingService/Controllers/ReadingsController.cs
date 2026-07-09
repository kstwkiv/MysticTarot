using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReadingService.Data;
using ReadingService.DTOs;
using ReadingService.Models;
using ReadingService.Services;

namespace ReadingService.Controllers;

[ApiController]
[Route("api/readings")]
[Authorize]
[Produces("application/json")]
public class ReadingsController : ControllerBase
{
    private readonly ReadingDbContext _db;
    private readonly TarotDeckService _deckService;
    private readonly OpenAiReadingService _openAiService;
    private readonly RabbitMqPublisher _publisher;
    private readonly ILogger<ReadingsController> _logger;

    public ReadingsController(
        ReadingDbContext db,
        TarotDeckService deckService,
        OpenAiReadingService openAiService,
        RabbitMqPublisher publisher,
        ILogger<ReadingsController> logger)
    {
        _db = db;
        _deckService = deckService;
        _openAiService = openAiService;
        _publisher = publisher;
        _logger = logger;
    }

    /// <summary>Perform an AI tarot reading</summary>
    /// <response code="201">Reading completed, returns cards and interpretation</response>
    /// <response code="400">Invalid spread type</response>
    [HttpPost("ai")]
    [ProducesResponseType(typeof(AiReadingResponse), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> PerformAiReading([FromBody] AiReadingRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var cardCount = request.SpreadType switch
        {
            SpreadType.SingleCard => 1,
            SpreadType.ThreeCard => 3,
            SpreadType.CelticCross => 10,
            _ => -1
        };

        if (cardCount == -1)
            return BadRequest(new { message = "Invalid spread type." });

        var drawnCards = _deckService.DrawCards(cardCount);
        var interpretation = await _openAiService.InterpretReadingAsync(
            drawnCards, request.SpreadType, request.Question);

        var reading = new Reading
        {
            UserId = userId,
            SpreadType = request.SpreadType,
            Question = request.Question,
            Cards = JsonSerializer.Serialize(drawnCards),
            Interpretation = interpretation
        };

        _db.Readings.Add(reading);
        await _db.SaveChangesAsync();

        try { _publisher.PublishReadingCompleted(reading.Id, userId, request.SpreadType.ToString()); }
        catch (Exception ex) { _logger.LogWarning(ex, "Failed to publish ReadingCompleted event"); }

        _logger.LogInformation("AI reading completed: {Id} for user {UserId}", reading.Id, userId);

        var response = new AiReadingResponse(
            reading.Id,
            reading.UserId,
            reading.SpreadType,
            reading.Question,
            drawnCards,
            reading.Interpretation,
            reading.CreatedAt
        );

        return CreatedAtAction(nameof(GetReadingById), new { id = reading.Id }, response);
    }

    /// <summary>Get current user's reading history</summary>
    /// <response code="200">List of readings</response>
    [HttpGet("my")]
    [ProducesResponseType(typeof(List<ReadingSummary>), 200)]
    public async Task<IActionResult> GetMyReadings()
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var readings = await _db.Readings
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReadingSummary(
                r.Id, r.UserId, r.SpreadType, r.Question, r.Cards, r.Interpretation, r.CreatedAt))
            .ToListAsync();

        return Ok(readings);
    }

    /// <summary>Get a reading by ID</summary>
    /// <response code="200">Reading found</response>
    /// <response code="403">Access denied</response>
    /// <response code="404">Reading not found</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ReadingSummary), 200)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetReadingById(Guid id)
    {
        var reading = await _db.Readings.FindAsync(id);
        if (reading is null) return NotFound(new { message = "Reading not found." });

        var userId = GetUserId();
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? User.FindFirst("role")?.Value;

        if (reading.UserId != userId && role != "Admin" && role != "Reader")
            return Forbid();

        return Ok(new ReadingSummary(
            reading.Id, reading.UserId, reading.SpreadType,
            reading.Question, reading.Cards, reading.Interpretation, reading.CreatedAt));
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        return claim is not null && Guid.TryParse(claim.Value, out var id) ? id : Guid.Empty;
    }
}
