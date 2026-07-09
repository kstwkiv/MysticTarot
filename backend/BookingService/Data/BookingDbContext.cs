using BookingService.Models;
using Microsoft.EntityFrameworkCore;

namespace BookingService.Data;

public class BookingDbContext : DbContext
{
    public BookingDbContext(DbContextOptions<BookingDbContext> options) : base(options) { }

    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(b => b.Id);
            entity.Property(b => b.ClientName).IsRequired().HasMaxLength(200);
            entity.Property(b => b.ClientEmail).IsRequired().HasMaxLength(256);
            entity.Property(b => b.Notes).HasMaxLength(1000);
            entity.Property(b => b.ReadingType).HasConversion<string>();
            entity.Property(b => b.Status).HasConversion<string>();
            entity.HasIndex(b => b.ClientId);
            entity.HasIndex(b => b.Status);
        });
    }
}
