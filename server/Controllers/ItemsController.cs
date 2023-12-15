using rms.Data;
using rms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace rms.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class ItemsController(Database database) : Controller
  {
    private readonly Database database = database;

    [HttpGet]
    public async Task<IActionResult> GetItems()
    {
      return Ok(await database.Items.ToListAsync());
    }

    [HttpGet]
    [Route("{itemId:int}")]
    public async Task<IActionResult> GetItem([FromRoute] int itemId)
    {
      var item = await database.Items.FindAsync(itemId);

      if (item == null)
      {
        return NotFound();
      }
      return Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> AddItem(AddItemRequest addItemRequest)
    {
      var newItem = new Item()
      {
        Name = addItemRequest.Name,
        Recipe = addItemRequest.Recipe,
        Price = addItemRequest.Price,
      };

      await database.Items.AddAsync(newItem);
      await database.SaveChangesAsync();

      return Ok(newItem);
    }

    [HttpDelete]
    [Route("{itemId:int}")]
    public async Task<IActionResult> DeleteItem([FromRoute] int itemId)
    {

      var item = await database.Items.FindAsync(itemId);
      if (item != null)
      {
        database.Remove(item);
        await database.SaveChangesAsync();
        return Ok();
      }

      return NotFound();
    }
  }
}