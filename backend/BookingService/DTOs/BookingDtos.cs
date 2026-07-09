using BookingService.Models;

namespace BookingService.DTOs;

public record CreateBookingRequest(
    string ClientName,
    string ClientEmail,
    ReadingType ReadingType,
    DateTime ScheduledAt,
    string? Notes
);
