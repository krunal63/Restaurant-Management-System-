using rms.Data;
using rms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace rms.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class EmployeesController(Database database) : Controller
  {
    private readonly Database database = database;

    [HttpGet]
    public async Task<IActionResult> GetEmployees()
    {
      return Ok(await database.Employees.ToListAsync());
    }

    [HttpGet]
    [Route("{employeeId:int}")]
    public async Task<IActionResult> GetEmployee([FromRoute] int employeeId)
    {
      var employee = await database.Employees.FindAsync(employeeId);

      if (employee == null)
      {
        return NotFound();
      }
      return Ok(employee);
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> LoginUser(LoginUserRequest loginUserRequest)
    {
      var user = await database.Employees.Where(u => u.Email == loginUserRequest.Email).FirstAsync();

      if (user != null && user.Password == loginUserRequest.Password)
      {
        return Ok(user);
      }
      return NotFound();
    }

    [HttpPost]
    [Route("signup")]
    public async Task<IActionResult> AddEmployee(AddEmployeeRequest addEmployeeRequest)
    {
      var newEmployee = new Employee()
      {
        Name = addEmployeeRequest.Name,
        Email = addEmployeeRequest.Email,
        Password = addEmployeeRequest.Password,
        Contact = addEmployeeRequest.Contact
      };

      await database.Employees.AddAsync(newEmployee);
      await database.SaveChangesAsync();

      return Ok(newEmployee);
    }

    [HttpDelete]
    [Route("{employeeId:int}")]
    public async Task<IActionResult> DeleteEmployee([FromRoute] int employeeId)
    {

      var employee = await database.Employees.FindAsync(employeeId);
      if (employee != null)
      {
        database.Remove(employee);
        await database.SaveChangesAsync();
        return Ok();
      }

      return NotFound();
    }
  }
}