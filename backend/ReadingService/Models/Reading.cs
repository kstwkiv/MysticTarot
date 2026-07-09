namespace ReadingService.Models;

public enum SpreadType
{
    SingleCard,
    ThreeCard,
    CelticCross
}

public class Reading
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public SpreadType SpreadType { get; set; }
    public string? Question { get; set; }
    public string Cards { get; set; } = "[]"; // JSON array of card names
    public string Interpretation { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
