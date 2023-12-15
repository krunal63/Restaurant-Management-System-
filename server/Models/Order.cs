namespace rms.Models
{
  public class Order
  {
    public int OrderId { get; set; }
    public int TableId { get; set; }
    public int ItemId { get; set; }
    public int EmployeeId { get; set; }
    public bool IsCompleted { get; set; }

    public Table? Table { get; set; }
    public Item? Item { get; set; }
    public Employee? Employee { get; set; }
  }
}