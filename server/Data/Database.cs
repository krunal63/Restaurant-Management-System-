using rms.Models;
using Microsoft.EntityFrameworkCore;

namespace rms.Data
{
  public class Database(DbContextOptions options) : DbContext(options)
  {
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Table> Tables { get; set; }
    public DbSet<Item> Items { get; set; }
    public DbSet<Order> Orders { get; set; }
  }
}