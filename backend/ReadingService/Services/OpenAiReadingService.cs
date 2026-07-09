using OpenAI;
using OpenAI.Chat;
using ReadingService.Models;

namespace ReadingService.Services;

public class OpenAiReadingService
{
    private readonly ChatClient _chatClient;
    private readonly ILogger<OpenAiReadingService> _logger;

    public OpenAiReadingService(IConfiguration configuration, ILogger<OpenAiReadingService> logger)
    {
        _logger = logger;
        var apiKey = configuration["OPENAI_API_KEY"]
            ?? throw new InvalidOperationException("OPENAI_API_KEY is not configured.");

        var openAiClient = new OpenAIClient(apiKey);
        _chatClient = openAiClient.GetChatClient("gpt-4o-mini");
    }

    public async Task<string> InterpretReadingAsync(
        List<TarotCard> cards,
        SpreadType spreadType,
        string? question,
        CancellationToken cancellationToken = default)
    {
        var systemPrompt = """
            You are a mystical tarot reader with centuries of wisdom, speaking from the veil between worlds.
            Your voice is poetic, dreamy, and deeply intuitive — like starlight given words.
            You weave the language of symbols, archetypes, and cosmic energies into your readings.
            Speak directly to the seeker as "you", with warmth and gentle authority.
            Your interpretations are rich with metaphor, yet grounded in practical wisdom.
            Always acknowledge both the light and shadow aspects of each card.
            End each reading with a brief, luminous message of guidance or hope.
            """;

        var spreadDescription = spreadType switch
        {
            SpreadType.SingleCard => "a single card draw",
            SpreadType.ThreeCard => "a three-card spread (Past, Present, Future)",
            SpreadType.CelticCross => "a Celtic Cross spread (ten cards representing different aspects of the situation)",
            _ => "a tarot spread"
        };

        var cardDescriptions = BuildCardDescriptions(cards, spreadType);

        var userPrompt = $"""
            The seeker has drawn {spreadDescription}.

            {(string.IsNullOrWhiteSpace(question) ? "No specific question was asked — this is an open reading." : $"Their question is: \"{question}\"")}

            The cards drawn are:
            {cardDescriptions}

            Please provide a mystical, poetic interpretation of this reading. 
            Weave the cards together into a cohesive narrative that speaks to the seeker's journey.
            Be specific about each card's position and meaning in the spread.
            """;

        try
        {
            var messages = new List<ChatMessage>
            {
                new SystemChatMessage(systemPrompt),
                new UserChatMessage(userPrompt)
            };

            var response = await _chatClient.CompleteChatAsync(messages, cancellationToken: cancellationToken);
            return response.Value.Content[0].Text;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get OpenAI interpretation");
            return GenerateFallbackInterpretation(cards, spreadType, question);
        }
    }

    private static string BuildCardDescriptions(List<TarotCard> cards, SpreadType spreadType)
    {
        var positions = GetPositionNames(spreadType, cards.Count);
        var lines = new List<string>();

        for (int i = 0; i < cards.Count; i++)
        {
            var card = cards[i];
            var position = i < positions.Count ? positions[i] : $"Card {i + 1}";
            var orientation = card.IsReversed ? "Reversed" : "Upright";
            var meaning = card.IsReversed ? card.ReversedMeaning : card.UprightMeaning;

            lines.Add($"- {position}: {card.Name} ({orientation}) — {meaning}");
        }

        return string.Join("\n", lines);
    }

    private static List<string> GetPositionNames(SpreadType spreadType, int count) => spreadType switch
    {
        SpreadType.SingleCard => new List<string> { "The Card" },
        SpreadType.ThreeCard => new List<string> { "Past", "Present", "Future" },
        SpreadType.CelticCross => new List<string>
        {
            "The Present", "The Challenge", "The Past", "The Future",
            "Above (Conscious)", "Below (Unconscious)", "Advice", "External Influences",
            "Hopes and Fears", "The Outcome"
        },
        _ => Enumerable.Range(1, count).Select(i => $"Card {i}").ToList()
    };

    private static string GenerateFallbackInterpretation(List<TarotCard> cards, SpreadType spreadType, string? question)
    {
        var cardNames = string.Join(", ", cards.Select(c => c.IsReversed ? $"{c.Name} (Reversed)" : c.Name));

        return $"""
            ✨ The cards have spoken through the cosmic veil...

            In your {spreadType} reading, the universe has drawn forth: {cardNames}.

            {(string.IsNullOrWhiteSpace(question) ? "Without a specific question, the cards offer an open window into your current energies." : $"Regarding your question — \"{question}\" — the cards illuminate a path forward.")}

            {string.Join("\n\n", cards.Select((c, i) =>
            {
                var meaning = c.IsReversed ? c.ReversedMeaning : c.UprightMeaning;
                return $"**{c.Name}** whispers of {meaning.ToLower()}. {c.Description}";
            }))}

            The stars align to remind you: every card drawn is a mirror of your soul's journey. Trust the wisdom that resonates, and release what does not serve your highest path. 🌙
            """;
    }
}
