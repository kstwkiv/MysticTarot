using Microsoft.AspNetCore.Mvc;
using ReadingService.Models;
using ReadingService.Services;

namespace ReadingService.Controllers;

[ApiController]
[Route("api/readings/cards")]
[Produces("application/json")]
public class CardsController : ControllerBase
{
    private readonly TarotDeckService _deckService;

    public CardsController(TarotDeckService deckService)
    {
        _deckService = deckService;
    }

    /// <summary>Get all 78 tarot cards</summary>
    /// <response code="200">Full tarot deck</response>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<TarotCard>), 200)]
    public IActionResult GetAllCards()
    {
        return Ok(_deckService.GetAllCards());
    }

    /// <summary>Draw a random set of cards from the deck</summary>
    /// <param name="count">Number of cards to draw (1–78)</param>
    /// <response code="200">Drawn cards</response>
    /// <response code="400">Invalid count</response>
    [HttpPost("draw")]
    [ProducesResponseType(typeof(List<TarotCard>), 200)]
    [ProducesResponseType(400)]
    public IActionResult DrawCards([FromBody] DrawCardsRequest request)
    {
        if (request.Count < 1 || request.Count > 78)
            return BadRequest(new { message = "Count must be between 1 and 78." });

        var cards = _deckService.DrawCards(request.Count);
        return Ok(cards);
    }
}

public record DrawCardsRequest(int Count);
