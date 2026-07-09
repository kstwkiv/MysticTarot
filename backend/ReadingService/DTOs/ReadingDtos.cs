using ReadingService.Models;

namespace ReadingService.DTOs;

public record AiReadingRequest(
    SpreadType SpreadType,
    string? Question
);

public record AiReadingResponse(
    Guid Id,
    Guid UserId,
    SpreadType SpreadType,
    string? Question,
    List<TarotCard> Cards,
    string Interpretation,
    DateTime CreatedAt
);

public record ReadingSummary(
    Guid Id,
    Guid UserId,
    SpreadType SpreadType,
    string? Question,
    string Cards,
    string Interpretation,
    DateTime CreatedAt
);
