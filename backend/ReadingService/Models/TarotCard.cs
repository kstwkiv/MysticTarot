namespace ReadingService.Models;

public class TarotCard
{
    public string Name { get; set; } = string.Empty;
    public string Arcana { get; set; } = string.Empty; // "Major" or "Minor"
    public string? Suit { get; set; } // Wands, Cups, Swords, Pentacles (null for Major)
    public int Number { get; set; }
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string UprightMeaning { get; set; } = string.Empty;
    public string ReversedMeaning { get; set; } = string.Empty;
    public bool IsReversed { get; set; } = false;
}
