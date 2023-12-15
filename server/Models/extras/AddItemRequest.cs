namespace rms.Models
{
  public class AddItemRequest
  {
    public required string Name { get; set; }
    public required string Recipe { get; set; }
    public required int Price { get; set; }
  }
}