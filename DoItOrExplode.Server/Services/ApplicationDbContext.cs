using DoItOrExplode.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace DoItOrExplode.Server.Services
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        public required DbSet<Todo> Todos { get; set; }
    }
}
