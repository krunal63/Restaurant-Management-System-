namespace rms.Models
{
  public class AddOrderRequest
  {
    public int TableId { get; set; }
    public int ItemId { get; set; }
    public int EmployeeId { get; set; }
    public bool IsCompleted { get; set; }
  }
}