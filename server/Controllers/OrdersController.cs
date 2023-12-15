using rms.Data;
using rms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace rms.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class OrdersController(Database database) : Controller
  {
    private readonly Database database = database;

    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
      return Ok(await database.Orders.Include(o => o.Table).Include(o => o.Employee).Include(o => o.Item).ToListAsync());
    }

    [HttpGet]
    [Route("{orderId:int}")]
    public async Task<IActionResult> GetOrder([FromRoute] int orderId)
    {
      var order = await database.Orders.FindAsync(orderId);

      if (order == null)
      {
        return NotFound();
      }
      return Ok(order);
    }

    [HttpGet]
    [Route("statistics")]
    public async Task<IActionResult> GetStatistics()
    {
      var totalTables = await database.Tables.CountAsync();
      var totalEmployees = await database.Employees.CountAsync();
      var totalCompletedOrders = await database.Orders.Where(o => o.IsCompleted == true).CountAsync();
      var totalRevenueData = await database.Orders.Include(o => o.Item).ToListAsync();
      var totalRevenue = 0;

      var i = new Item()
      {
        Name = "",
        Recipe = "",
        Price = 0,
      };
      totalRevenueData.ForEach(data =>
      {
        totalRevenue += (data.Item ?? i).Price;
      });

      var statistics = new Statistics()
      {
        TotalTables = totalTables,
        TotalEmployees = totalEmployees,
        TotalCompletedOrders = totalCompletedOrders,
        TotalRevenue = totalRevenue
      };
      return Ok(statistics);
    }

    [HttpPost]
    public async Task<IActionResult> AddOrder(AddOrderRequest addOrderRequest)
    {
      var newOrder = new Order()
      {
        TableId = addOrderRequest.TableId,
        ItemId = addOrderRequest.ItemId,
        EmployeeId = addOrderRequest.EmployeeId,
        IsCompleted = addOrderRequest.IsCompleted
      };

      await database.Orders.AddAsync(newOrder);
      await database.SaveChangesAsync();

      return Ok(newOrder);
    }

    [HttpPut]
    [Route("{orderId:int}")]
    public async Task<IActionResult> UpdateOrder([FromRoute] int orderId)
    {
      var order = await database.Orders.FindAsync(orderId);

      if (order != null)
      {
        order.IsCompleted = true;

        await database.SaveChangesAsync();
        return Ok(order);
      }
      return NotFound();
    }

    [HttpDelete]
    [Route("{orderId:int}")]
    public async Task<IActionResult> DeleteOrder([FromRoute] int orderId)
    {

      var order = await database.Orders.FindAsync(orderId);
      if (order != null)
      {
        database.Remove(order);
        await database.SaveChangesAsync();
        return Ok();
      }

      return NotFound();
    }
  }
}