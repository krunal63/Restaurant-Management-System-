using Microsoft.EntityFrameworkCore;

namespace rms.Models
{
  public class AddTableRequest
  {
    public required string Name { get; set; }
  }
}