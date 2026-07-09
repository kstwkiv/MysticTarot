using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace NotificationService.Services;

public class RabbitMqConsumer : BackgroundService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<RabbitMqConsumer> _logger;
    private IConnection? _connection;
    private IModel? _channel;
    private const string ExchangeName = "tarot.events";
    private const string QueueName = "tarot.notifications";

    public RabbitMqConsumer(IConfiguration configuration, ILogger<RabbitMqConsumer> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await ConnectWithRetryAsync(stoppingToken);

        if (_channel is null) return;

        var consumer = new EventingBasicConsumer(_channel);
        consumer.Received += OnMessageReceived;

        _channel.BasicConsume(
            queue: QueueName,
            autoAck: true,
            consumer: consumer);

        _logger.LogInformation("NotificationService is listening for events on exchange '{Exchange}'", ExchangeName);

        // Keep running until cancellation
        await Task.Delay(Timeout.Infinite, stoppingToken);
    }

    private async Task ConnectWithRetryAsync(CancellationToken cancellationToken)
    {
        var retries = 0;
        const int maxRetries = 10;

        while (retries < maxRetries && !cancellationToken.IsCancellationRequested)
        {
            try
            {
                var factory = new ConnectionFactory
                {
                    HostName = _configuration["RABBITMQ_HOST"] ?? "rabbitmq",
                    UserName = _configuration["RABBITMQ_USER"] ?? "guest",
                    Password = _configuration["RABBITMQ_PASS"] ?? "guest",
                    RequestedHeartbeat = TimeSpan.FromSeconds(60),
                    AutomaticRecoveryEnabled = true
                };

                _connection = factory.CreateConnection();
                _channel = _connection.CreateModel();

                // Declare exchange
                _channel.ExchangeDeclare(ExchangeName, ExchangeType.Topic, durable: true);

                // Declare queue
                _channel.QueueDeclare(
                    queue: QueueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false);

                // Bind to all tarot events
                _channel.QueueBind(QueueName, ExchangeName, "booking.confirmed");
                _channel.QueueBind(QueueName, ExchangeName, "booking.cancelled");
                _channel.QueueBind(QueueName, ExchangeName, "reading.completed");

                _logger.LogInformation("Successfully connected to RabbitMQ");
                return;
            }
            catch (Exception ex)
            {
                retries++;
                _logger.LogWarning(ex, "Failed to connect to RabbitMQ (attempt {Attempt}/{Max}). Retrying in 5s...", retries, maxRetries);
                await Task.Delay(5000, cancellationToken);
            }
        }

        _logger.LogError("Could not connect to RabbitMQ after {MaxRetries} attempts", maxRetries);
    }

    private void OnMessageReceived(object? sender, BasicDeliverEventArgs args)
    {
        try
        {
            var body = Encoding.UTF8.GetString(args.Body.ToArray());
            var routingKey = args.RoutingKey;

            _logger.LogInformation("Received event with routing key: {RoutingKey}", routingKey);

            using var doc = JsonDocument.Parse(body);
            var root = doc.RootElement;
            var eventType = root.TryGetProperty("EventType", out var et) ? et.GetString() : routingKey;

            switch (eventType)
            {
                case "BookingConfirmed":
                    HandleBookingConfirmed(root);
                    break;
                case "BookingCancelled":
                    HandleBookingCancelled(root);
                    break;
                case "ReadingCompleted":
                    HandleReadingCompleted(root);
                    break;
                default:
                    _logger.LogWarning("Unknown event type: {EventType}", eventType);
                    break;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing message from RabbitMQ");
        }
    }

    private void HandleBookingConfirmed(JsonElement root)
    {
        var bookingId = root.TryGetProperty("BookingId", out var bid) ? bid.GetString() : "unknown";
        var clientEmail = root.TryGetProperty("ClientEmail", out var ce) ? ce.GetString() : "unknown";
        var scheduledAt = root.TryGetProperty("ScheduledAt", out var sa) ? sa.GetString() : "unknown";

        _logger.LogInformation(
            "[NOTIFICATION] Booking Confirmed — BookingId: {BookingId}, Client: {Email}, Scheduled: {ScheduledAt}",
            bookingId, clientEmail, scheduledAt);

        // In a real application, send an email here:
        // await _emailService.SendBookingConfirmationAsync(clientEmail, bookingId, scheduledAt);
        _logger.LogInformation("[EMAIL SIMULATION] Sending booking confirmation email to {Email}", clientEmail);
    }

    private void HandleBookingCancelled(JsonElement root)
    {
        var bookingId = root.TryGetProperty("BookingId", out var bid) ? bid.GetString() : "unknown";
        var clientEmail = root.TryGetProperty("ClientEmail", out var ce) ? ce.GetString() : "unknown";

        _logger.LogInformation(
            "[NOTIFICATION] Booking Cancelled — BookingId: {BookingId}, Client: {Email}",
            bookingId, clientEmail);

        _logger.LogInformation("[EMAIL SIMULATION] Sending booking cancellation email to {Email}", clientEmail);
    }

    private void HandleReadingCompleted(JsonElement root)
    {
        var readingId = root.TryGetProperty("ReadingId", out var rid) ? rid.GetString() : "unknown";
        var userId = root.TryGetProperty("UserId", out var uid) ? uid.GetString() : "unknown";
        var spreadType = root.TryGetProperty("SpreadType", out var st) ? st.GetString() : "unknown";

        _logger.LogInformation(
            "[NOTIFICATION] Reading Completed — ReadingId: {ReadingId}, UserId: {UserId}, Spread: {SpreadType}",
            readingId, userId, spreadType);

        _logger.LogInformation("[EMAIL SIMULATION] Sending reading completion notification for user {UserId}", userId);
    }

    public override void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
        base.Dispose();
    }
}
