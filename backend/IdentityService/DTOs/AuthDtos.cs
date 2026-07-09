namespace IdentityService.DTOs;

public record RegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string Role = "Client"
);

public record LoginRequest(
    string Email,
    string Password
);

public record AuthResponse(
    string Token,
    string Email,
    string FirstName,
    string LastName,
    string Role,
    Guid UserId,
    DateTime ExpiresAt
);

public record UserInfoResponse(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string Role,
    DateTime CreatedAt
);
