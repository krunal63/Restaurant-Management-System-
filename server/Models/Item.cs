namespace rms.Models
{
  public class Item
  {
    public int ItemId { get; set; }
    public required string Name { get; set; }
    public required string Recipe { get; set; }
    public required int Price { get; set; }
  }
}