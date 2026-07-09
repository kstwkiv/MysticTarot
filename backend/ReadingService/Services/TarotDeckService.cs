using ReadingService.Models;

namespace ReadingService.Services;

public class TarotDeckService
{
    private static readonly List<TarotCard> _deck = BuildDeck();

    public IReadOnlyList<TarotCard> GetAllCards() => _deck.AsReadOnly();

    public List<TarotCard> DrawCards(int count)
    {
        if (count <= 0 || count > _deck.Count)
            throw new ArgumentOutOfRangeException(nameof(count), "Count must be between 1 and 78.");

        var shuffled = _deck.OrderBy(_ => Random.Shared.Next()).ToList();
        var drawn = shuffled.Take(count).ToList();

        // Randomly reverse some cards
        foreach (var card in drawn)
        {
            card.IsReversed = Random.Shared.Next(2) == 1;
        }

        return drawn;
    }

    private static List<TarotCard> BuildDeck()
    {
        var cards = new List<TarotCard>();

        // ── Major Arcana ─────────────────────────────────────────────────────
        cards.AddRange(new[]
        {
            new TarotCard { Name = "The Fool", Arcana = "Major", Number = 0,
                Description = "The Fool represents new beginnings, spontaneity, and a free spirit.",
                ImageUrl = "/assets/cards/major/fool.jpg",
                UprightMeaning = "New beginnings, innocence, spontaneity, a free spirit",
                ReversedMeaning = "Holding back, recklessness, risk-taking" },

            new TarotCard { Name = "The Magician", Arcana = "Major", Number = 1,
                Description = "The Magician represents willpower, desire, creation, and manifestation.",
                ImageUrl = "/assets/cards/major/magician.jpg",
                UprightMeaning = "Willpower, desire, creation, manifestation",
                ReversedMeaning = "Trickery, illusions, out of touch" },

            new TarotCard { Name = "The High Priestess", Arcana = "Major", Number = 2,
                Description = "The High Priestess represents intuition, sacred knowledge, and the divine feminine.",
                ImageUrl = "/assets/cards/major/high-priestess.jpg",
                UprightMeaning = "Intuition, sacred knowledge, divine feminine, the subconscious mind",
                ReversedMeaning = "Secrets, disconnected from intuition, withdrawal" },

            new TarotCard { Name = "The Empress", Arcana = "Major", Number = 3,
                Description = "The Empress represents femininity, beauty, nature, and abundance.",
                ImageUrl = "/assets/cards/major/empress.jpg",
                UprightMeaning = "Femininity, beauty, nature, nurturing, abundance",
                ReversedMeaning = "Creative block, dependence on others" },

            new TarotCard { Name = "The Emperor", Arcana = "Major", Number = 4,
                Description = "The Emperor represents authority, establishment, structure, and a father figure.",
                ImageUrl = "/assets/cards/major/emperor.jpg",
                UprightMeaning = "Authority, establishment, structure, a father figure",
                ReversedMeaning = "Domination, excessive control, lack of discipline" },

            new TarotCard { Name = "The Hierophant", Arcana = "Major", Number = 5,
                Description = "The Hierophant represents spiritual wisdom, religious beliefs, and conformity.",
                ImageUrl = "/assets/cards/major/hierophant.jpg",
                UprightMeaning = "Spiritual wisdom, religious beliefs, conformity, tradition",
                ReversedMeaning = "Personal beliefs, freedom, challenging the status quo" },

            new TarotCard { Name = "The Lovers", Arcana = "Major", Number = 6,
                Description = "The Lovers represents love, harmony, relationships, and values alignment.",
                ImageUrl = "/assets/cards/major/lovers.jpg",
                UprightMeaning = "Love, harmony, relationships, values alignment, choices",
                ReversedMeaning = "Self-love, disharmony, imbalance, misaligned values" },

            new TarotCard { Name = "The Chariot", Arcana = "Major", Number = 7,
                Description = "The Chariot represents control, willpower, success, and determination.",
                ImageUrl = "/assets/cards/major/chariot.jpg",
                UprightMeaning = "Control, willpower, success, action, determination",
                ReversedMeaning = "Self-discipline, opposition, lack of direction" },

            new TarotCard { Name = "Strength", Arcana = "Major", Number = 8,
                Description = "Strength represents strength, courage, persuasion, and influence.",
                ImageUrl = "/assets/cards/major/strength.jpg",
                UprightMeaning = "Strength, courage, persuasion, influence, compassion",
                ReversedMeaning = "Inner strength, self-doubt, low energy, raw emotion" },

            new TarotCard { Name = "The Hermit", Arcana = "Major", Number = 9,
                Description = "The Hermit represents soul-searching, introspection, and inner guidance.",
                ImageUrl = "/assets/cards/major/hermit.jpg",
                UprightMeaning = "Soul-searching, introspection, being alone, inner guidance",
                ReversedMeaning = "Isolation, loneliness, withdrawal" },

            new TarotCard { Name = "Wheel of Fortune", Arcana = "Major", Number = 10,
                Description = "The Wheel of Fortune represents good luck, karma, life cycles, and destiny.",
                ImageUrl = "/assets/cards/major/wheel-of-fortune.jpg",
                UprightMeaning = "Good luck, karma, life cycles, destiny, a turning point",
                ReversedMeaning = "Bad luck, resistance to change, breaking cycles" },

            new TarotCard { Name = "Justice", Arcana = "Major", Number = 11,
                Description = "Justice represents justice, fairness, truth, cause and effect.",
                ImageUrl = "/assets/cards/major/justice.jpg",
                UprightMeaning = "Justice, fairness, truth, cause and effect, law",
                ReversedMeaning = "Unfairness, lack of accountability, dishonesty" },

            new TarotCard { Name = "The Hanged Man", Arcana = "Major", Number = 12,
                Description = "The Hanged Man represents pause, surrender, letting go, and new perspectives.",
                ImageUrl = "/assets/cards/major/hanged-man.jpg",
                UprightMeaning = "Pause, surrender, letting go, new perspectives",
                ReversedMeaning = "Delays, resistance, stalling, indecision" },

            new TarotCard { Name = "Death", Arcana = "Major", Number = 13,
                Description = "Death represents endings, change, transformation, and transition.",
                ImageUrl = "/assets/cards/major/death.jpg",
                UprightMeaning = "Endings, change, transformation, transition",
                ReversedMeaning = "Resistance to change, personal transformation, inner purging" },

            new TarotCard { Name = "Temperance", Arcana = "Major", Number = 14,
                Description = "Temperance represents balance, moderation, patience, and purpose.",
                ImageUrl = "/assets/cards/major/temperance.jpg",
                UprightMeaning = "Balance, moderation, patience, purpose, meaning",
                ReversedMeaning = "Imbalance, excess, self-healing, re-alignment" },

            new TarotCard { Name = "The Devil", Arcana = "Major", Number = 15,
                Description = "The Devil represents shadow self, attachment, addiction, and restriction.",
                ImageUrl = "/assets/cards/major/devil.jpg",
                UprightMeaning = "Shadow self, attachment, addiction, restriction, sexuality",
                ReversedMeaning = "Releasing limiting beliefs, exploring dark thoughts, detachment" },

            new TarotCard { Name = "The Tower", Arcana = "Major", Number = 16,
                Description = "The Tower represents sudden change, upheaval, chaos, and revelation.",
                ImageUrl = "/assets/cards/major/tower.jpg",
                UprightMeaning = "Sudden change, upheaval, chaos, revelation, awakening",
                ReversedMeaning = "Personal transformation, fear of change, averting disaster" },

            new TarotCard { Name = "The Star", Arcana = "Major", Number = 17,
                Description = "The Star represents hope, faith, purpose, renewal, and spirituality.",
                ImageUrl = "/assets/cards/major/star.jpg",
                UprightMeaning = "Hope, faith, purpose, renewal, spirituality",
                ReversedMeaning = "Lack of faith, despair, self-trust, disconnection" },

            new TarotCard { Name = "The Moon", Arcana = "Major", Number = 18,
                Description = "The Moon represents illusion, fear, the unconscious, and confusion.",
                ImageUrl = "/assets/cards/major/moon.jpg",
                UprightMeaning = "Illusion, fear, the unconscious, confusion, complexity",
                ReversedMeaning = "Release of fear, repressed emotion, inner confusion" },

            new TarotCard { Name = "The Sun", Arcana = "Major", Number = 19,
                Description = "The Sun represents positivity, fun, warmth, success, and vitality.",
                ImageUrl = "/assets/cards/major/sun.jpg",
                UprightMeaning = "Positivity, fun, warmth, success, vitality",
                ReversedMeaning = "Inner child, feeling down, overly optimistic" },

            new TarotCard { Name = "Judgement", Arcana = "Major", Number = 20,
                Description = "Judgement represents judgement, rebirth, inner calling, and absolution.",
                ImageUrl = "/assets/cards/major/judgement.jpg",
                UprightMeaning = "Judgement, rebirth, inner calling, absolution",
                ReversedMeaning = "Self-doubt, inner critic, ignoring the call" },

            new TarotCard { Name = "The World", Arcana = "Major", Number = 21,
                Description = "The World represents completion, integration, accomplishment, and travel.",
                ImageUrl = "/assets/cards/major/world.jpg",
                UprightMeaning = "Completion, integration, accomplishment, travel",
                ReversedMeaning = "Seeking personal closure, short-cuts, delays" }
        });

        // ── Minor Arcana ─────────────────────────────────────────────────────
        var suits = new[]
        {
            ("Wands", "fire", "creativity, will, inspiration"),
            ("Cups", "water", "emotions, intuition, relationships"),
            ("Swords", "air", "intellect, conflict, truth"),
            ("Pentacles", "earth", "material world, finances, work")
        };

        var ranks = new[]
        {
            (1, "Ace"), (2, "Two"), (3, "Three"), (4, "Four"), (5, "Five"),
            (6, "Six"), (7, "Seven"), (8, "Eight"), (9, "Nine"), (10, "Ten"),
            (11, "Page"), (12, "Knight"), (13, "Queen"), (14, "King")
        };

        foreach (var (suit, element, theme) in suits)
        {
            foreach (var (number, rankName) in ranks)
            {
                var cardName = $"{rankName} of {suit}";
                var slug = $"{rankName.ToLower()}-of-{suit.ToLower()}";

                cards.Add(new TarotCard
                {
                    Name = cardName,
                    Arcana = "Minor",
                    Suit = suit,
                    Number = number,
                    Description = $"The {cardName} relates to the {element} element and themes of {theme}.",
                    ImageUrl = $"/assets/cards/minor/{slug}.jpg",
                    UprightMeaning = GetUprightMeaning(suit, number),
                    ReversedMeaning = GetReversedMeaning(suit, number)
                });
            }
        }

        return cards;
    }

    private static string GetUprightMeaning(string suit, int number) => (suit, number) switch
    {
        ("Wands", 1) => "Inspiration, new opportunities, growth, potential",
        ("Wands", 2) => "Future planning, progress, decisions, discovery",
        ("Wands", 3) => "Expansion, foresight, overseas opportunities",
        ("Wands", 4) => "Celebration, joy, harmony, relaxation, homecoming",
        ("Wands", 5) => "Conflict, disagreements, competition, tension",
        ("Wands", 6) => "Success, public recognition, progress, self-confidence",
        ("Wands", 7) => "Challenge, competition, protection, perseverance",
        ("Wands", 8) => "Speed, action, air travel, movement, swift change",
        ("Wands", 9) => "Resilience, courage, persistence, test of faith",
        ("Wands", 10) => "Burden, extra responsibility, hard work, completion",
        ("Wands", 11) => "Enthusiasm, exploration, discovery, free spirit",
        ("Wands", 12) => "Energy, passion, inspired action, adventure",
        ("Wands", 13) => "Courage, confidence, independence, social butterfly",
        ("Wands", 14) => "Natural-born leader, vision, entrepreneur, honour",

        ("Cups", 1) => "New feelings, spirituality, intuition, intimacy",
        ("Cups", 2) => "Unified love, partnership, mutual attraction",
        ("Cups", 3) => "Celebration, friendship, creativity, community",
        ("Cups", 4) => "Meditation, contemplation, apathy, re-evaluation",
        ("Cups", 5) => "Regret, failure, disappointment, pessimism",
        ("Cups", 6) => "Revisiting the past, childhood memories, innocence",
        ("Cups", 7) => "Opportunities, choices, wishful thinking, illusion",
        ("Cups", 8) => "Disappointment, abandonment, withdrawal, escapism",
        ("Cups", 9) => "Contentment, satisfaction, gratitude, wish come true",
        ("Cups", 10) => "Divine love, blissful relationships, harmony, alignment",
        ("Cups", 11) => "Creative opportunities, intuition, possibility",
        ("Cups", 12) => "Romance, charm, imagination, beauty, affection",
        ("Cups", 13) => "Compassion, calm, intuitive, inner feelings, flow",
        ("Cups", 14) => "Emotional balance, compassion, diplomacy, calm",

        ("Swords", 1) => "Breakthroughs, new ideas, mental clarity, success",
        ("Swords", 2) => "Difficult decisions, weighing options, indecision",
        ("Swords", 3) => "Heartbreak, emotional pain, sorrow, grief, hurt",
        ("Swords", 4) => "Rest, relaxation, meditation, contemplation",
        ("Swords", 5) => "Conflict, disagreements, competition, defeat",
        ("Swords", 6) => "Transition, change, rite of passage, releasing baggage",
        ("Swords", 7) => "Betrayal, deception, getting away with something",
        ("Swords", 8) => "Imprisonment, entrapment, self-victimization",
        ("Swords", 9) => "Anxiety, worry, fear, depression, nightmares",
        ("Swords", 10) => "Painful endings, deep wounds, betrayal, loss",
        ("Swords", 11) => "New ideas, curiosity, thirst for knowledge",
        ("Swords", 12) => "Ambitious, action-oriented, driven to succeed",
        ("Swords", 13) => "Independent, unbiased judgement, clear boundaries",
        ("Swords", 14) => "Mental clarity, intellectual power, authority, truth",

        ("Pentacles", 1) => "Opportunity, prosperity, new venture, manifestation",
        ("Pentacles", 2) => "Multiple priorities, time management, prioritisation",
        ("Pentacles", 3) => "Teamwork, initial fulfilment, collaboration, learning",
        ("Pentacles", 4) => "Saving money, security, conservatism, scarcity",
        ("Pentacles", 5) => "Financial loss, poverty, lack mindset, isolation",
        ("Pentacles", 6) => "Giving, receiving, sharing wealth, generosity",
        ("Pentacles", 7) => "Long-term view, sustainable results, perseverance",
        ("Pentacles", 8) => "Apprenticeship, repetitive tasks, mastery, skill",
        ("Pentacles", 9) => "Abundance, luxury, self-sufficiency, financial independence",
        ("Pentacles", 10) => "Wealth, financial security, family, long-term success",
        ("Pentacles", 11) => "Opportunity, ambition, desire, diligence, studiousness",
        ("Pentacles", 12) => "Hard work, productivity, routine, conservatism",
        ("Pentacles", 13) => "Nurturing, practical, providing financially, a working parent",
        ("Pentacles", 14) => "Abundance, prosperity, security, ambition, discipline",

        _ => "Meaning varies with context and surrounding cards"
    };

    private static string GetReversedMeaning(string suit, int number) => (suit, number) switch
    {
        ("Wands", 1) => "An emerging idea, lack of direction, distractions",
        ("Wands", 2) => "Personal goals, inner alignment, fear of unknown",
        ("Wands", 3) => "Playing it safe, lack of foresight, unexpected delays",
        ("Wands", 4) => "Personal celebration, inner harmony, conflict at home",
        ("Wands", 5) => "Inner conflict, conflict avoidance, tension release",
        ("Wands", 6) => "Ego, disrepute, lack of confidence, fall from grace",
        ("Wands", 7) => "Exhaustion, giving up, overwhelmed",
        ("Wands", 8) => "Delays, frustration, resisting change",
        ("Wands", 9) => "Inner resources, struggle, overwhelm, defensive",
        ("Wands", 10) => "Doing it all, carrying the burden, delegation",
        ("Wands", 11) => "Newly-formed ideas, redirecting energy, self-limiting",
        ("Wands", 12) => "Passion project, haste, scattered energy",
        ("Wands", 13) => "Ruthless, high expectations, compulsiveness",
        ("Wands", 14) => "Impulsiveness, haste, ruthless, high expectations",

        ("Cups", 1) => "Blocked creativity, emptiness, emotional loss",
        ("Cups", 2) => "Self-love, break-ups, disharmony, distrust",
        ("Cups", 3) => "Independence, alone time, hardcore partying",
        ("Cups", 4) => "Retreat, withdrawal, checking in for alignment",
        ("Cups", 5) => "Personal setbacks, self-forgiveness, moving on",
        ("Cups", 6) => "Living in the past, forgiveness, lacking playfulness",
        ("Cups", 7) => "Alignment, personal values, overwhelmed by choices",
        ("Cups", 8) => "Trying one more time, indecision, aimless drifting",
        ("Cups", 9) => "Inner happiness, materialism, dissatisfaction",
        ("Cups", 10) => "Shattered dreams, broken family, domestic disharmony",
        ("Cups", 11) => "Emotional immaturity, insecurity, disappointment",
        ("Cups", 12) => "Overactive imagination, unrealistic, seductive",
        ("Cups", 13) => "Emotional insecurity, co-dependency, martyrdom",
        ("Cups", 14) => "Self-compassion, inner feelings, repressed emotion",

        ("Swords", 1) => "Inner clarity, re-thinking a decision, clouded judgement",
        ("Swords", 2) => "Indecision, confusion, information overload",
        ("Swords", 3) => "Negative self-talk, releasing pain, optimism, forgiveness",
        ("Swords", 4) => "Exhaustion, burn-out, deep contemplation, stagnation",
        ("Swords", 5) => "Reconciliation, making amends, past resentment",
        ("Swords", 6) => "Personal transition, resistance to change, unfinished business",
        ("Swords", 7) => "Imposter syndrome, self-deceit, keeping secrets",
        ("Swords", 8) => "Self-limiting beliefs, inner critic, releasing restrictions",
        ("Swords", 9) => "Inner turmoil, deep-seated fears, secrets, releasing worry",
        ("Swords", 10) => "Recovery, regeneration, resisting an inevitable end",
        ("Swords", 11) => "Self-expression, all talk and no action, haste",
        ("Swords", 12) => "Restless, unfocused, impulsive",
        ("Swords", 13) => "Overly-emotional, easily influenced, cold-heartedness",
        ("Swords", 14) => "Quiet power, inner truth, misuse of power, manipulation",

        ("Pentacles", 1) => "Lost opportunity, lack of planning and foresight",
        ("Pentacles", 2) => "Over-committed, disorganisation, reprioritisation",
        ("Pentacles", 3) => "Disharmony, misalignment, working alone",
        ("Pentacles", 4) => "Over-spending, greed, self-protection",
        ("Pentacles", 5) => "Recovery from financial loss, spiritual poverty",
        ("Pentacles", 6) => "Self-care, unpaid debts, one-sided charity",
        ("Pentacles", 7) => "Work without results, distractions, lack of rewards",
        ("Pentacles", 8) => "Self-development, perfectionism, misdirected activity",
        ("Pentacles", 9) => "Self-worth, over-investment in work, hustling",
        ("Pentacles", 10) => "The dark side of wealth, financial failure, loss",
        ("Pentacles", 11) => "Lack of commitment, greediness, laziness, missed chances",
        ("Pentacles", 12) => "Self-development, revisiting approaches, shortcuts",
        ("Pentacles", 13) => "Financial independence, self-care, work-home conflict",
        ("Pentacles", 14) => "Financial ineptitude, obsessed with wealth, stubbornness",

        _ => "Blocked or reversed energy in this area"
    };
}
