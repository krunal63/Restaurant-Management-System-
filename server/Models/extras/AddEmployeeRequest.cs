namespace rms.Models
{
  public class AddEmployeeRequest
  {
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string Contact { get; set; }
  }
}