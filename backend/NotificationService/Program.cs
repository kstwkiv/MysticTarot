using NotificationService.Services;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddHostedService<RabbitMqConsumer>();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var host = builder.Build();
host.Run();
