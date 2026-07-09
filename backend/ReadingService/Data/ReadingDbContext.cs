using Microsoft.EntityFrameworkCore;
using ReadingService.Models;

namespace ReadingService.Data;

public class ReadingDbContext : DbContext
{
    public ReadingDbContext(DbContextOptions<ReadingDbContext> options) : base(options) { }

    public DbSet<Reading> Readings => Set<Reading>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Reading>(entity =>
        {
            entity.HasKey(r => r.Id);
            entity.Property(r => r.Cards).IsRequired().HasColumnType("nvarchar(max)");
            entity.Property(r => r.Interpretation).IsRequired().HasColumnType("nvarchar(max)");
            entity.Property(r => r.Question).HasMaxLength(1000);
            entity.Property(r => r.SpreadType).HasConversion<string>();
            entity.HasIndex(r => r.UserId);
        });
    }
}
