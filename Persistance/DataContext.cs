using System;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistance
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
            
        }

        public DbSet<Value> Values { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Value>()
                .HasData(
                    new Value { Id = 1, Name = "101"},
                    new Value { Id = 2, Name = "102"},
                    new Value { Id = 3, Name = "103"},
                    new Value { Id = 4, Name = "104"}
                );
        }
    }
}
