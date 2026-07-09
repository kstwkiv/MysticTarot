using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ReadingService.Data;

public class ReadingDbContextFactory : IDesignTimeDbContextFactory<ReadingDbContext>
{
    public ReadingDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ReadingDbContext>();
        optionsBuilder.UseSqlServer(
            "Server=.\\SQLEXPRESS;Database=TarotReadings;Integrated Security=True;TrustServerCertificate=True;");
        return new ReadingDbContext(optionsBuilder.Options);
    }
}
