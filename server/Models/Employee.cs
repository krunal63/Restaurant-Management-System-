namespace rms.Models
{
  public class Employee
  {
    public int EmployeeId { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string Contact { get; set; }
  }
}