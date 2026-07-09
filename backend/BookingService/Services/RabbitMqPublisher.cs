using System.Text;
using System.Text.Json;
using RabbitMQ.Client;

namespace BookingService.Services;

public class RabbitMqPublisher : IDisposable
{
    private IConnection? _connection;
    private IModel? _channel;
    private const string ExchangeName = "tarot.events";
    private readonly ILogger<RabbitMqPublisher> _logger;
    private readonly ConnectionFactory _factory;
    private bool _available = false;

    public RabbitMqPublisher(IConfiguration configuration, ILogger<RabbitMqPublisher> logger)
    {
        _logger = logger;
        _factory = new ConnectionFactory
        {
            HostName = configuration["RABBITMQ_HOST"] ?? "localhost",
            UserName = configuration["RABBITMQ_USER"] ?? "guest",
            Password = configuration["RABBITMQ_PASS"] ?? "guest",
            RequestedHeartbeat = TimeSpan.FromSeconds(60),
            AutomaticRecoveryEnabled = true
        };

        TryConnect();
    }

    private void TryConnect()
    {
        try
        {
            _connection = _factory.CreateConnection();
            _channel = _connection.CreateModel();
            _channel.ExchangeDeclare(ExchangeName, ExchangeType.Topic, durable: true);
            _available = true;
            _logger.LogInformation("RabbitMQ connected successfully.");
        }
        catch (Exception ex)
        {
            _available = false;
            _logger.LogWarning("RabbitMQ unavailable — events will be skipped. ({Message})", ex.Message);
        }
    }

    public void PublishBookingConfirmed(Guid bookingId, Guid clientId, string clientEmail, DateTime scheduledAt)
    {
        if (!_available) { _logger.LogWarning("Skipping BookingConfirmed event — RabbitMQ not available."); return; }

        var message = new
        {
            EventType = "BookingConfirmed",
            BookingId = bookingId,
            ClientId = clientId,
            ClientEmail = clientEmail,
            ScheduledAt = scheduledAt,
            Timestamp = DateTime.UtcNow
        };

        Publish("booking.confirmed", message);
        _logger.LogInformation("Published BookingConfirmed event for booking {BookingId}", bookingId);
    }

    public void PublishBookingCancelled(Guid bookingId, Guid clientId, string clientEmail)
    {
        if (!_available) { _logger.LogWarning("Skipping BookingCancelled event — RabbitMQ not available."); return; }

        var message = new
        {
            EventType = "BookingCancelled",
            BookingId = bookingId,
            ClientId = clientId,
            ClientEmail = clientEmail,
            Timestamp = DateTime.UtcNow
        };

        Publish("booking.cancelled", message);
        _logger.LogInformation("Published BookingCancelled event for booking {BookingId}", bookingId);
    }

    private void Publish(string routingKey, object message)
    {
        if (_channel is null || !_channel.IsOpen) return;

        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
        var props = _channel.CreateBasicProperties();
        props.Persistent = true;
        props.ContentType = "application/json";

        _channel.BasicPublish(
            exchange: ExchangeName,
            routingKey: routingKey,
            basicProperties: props,
            body: body);
    }

    public void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
    }
}
