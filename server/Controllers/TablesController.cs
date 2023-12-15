using rms.Data;
using rms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace rms.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class TablesController(Database database) : Controller
  {
    private readonly Database database = database;

    [HttpGet]
    public async Task<IActionResult> GetTables()
    {
      return Ok(await database.Tables.ToListAsync());
    }

    [HttpGet]
    [Route("{tableId:int}")]
    public async Task<IActionResult> GetTable([FromRoute] int tableId)
    {
      var table = await database.Tables.FindAsync(tableId);

      if (table == null)
      {
        return NotFound();
      }
      return Ok(table);
    }

    [HttpPost]
    public async Task<IActionResult> AddTable(AddTableRequest addTableRequest)
    {
      var newTable = new Table()
      {
        Name = addTableRequest.Name,
      };

      await database.Tables.AddAsync(newTable);
      await database.SaveChangesAsync();

      return Ok(newTable);
    }

    [HttpDelete]
    [Route("{tableId:int}")]
    public async Task<IActionResult> DeleteTable([FromRoute] int tableId)
    {

      var table = await database.Tables.FindAsync(tableId);
      if (table != null)
      {
        database.Remove(table);
        await database.SaveChangesAsync();
        return Ok();
      }

      return NotFound();
    }
  }
}