using DoItOrExplode.Server.Models;
using DoItOrExplode.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

//The different endpoints, connecting the backend and the frontend
namespace DoItOrExplode.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public TodoController(ApplicationDbContext context)
        {
            this.context = context;
        }
        //Sends the todos to the frontend
        [HttpGet]
        public async Task<ActionResult<Todo>> GetTodos()
        {
            var todos = await context.Todos.ToListAsync();
            return Ok(todos);
        }

        //Sends the todo with the id to the frontend
        [HttpGet("{id}")]
        public async Task<ActionResult<Todo>> GetTodo(int id)
        {
            var todo = await context.Todos.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }

            return Ok(todo);
        }

        [HttpPost]
        public async Task<ActionResult<Todo>> AddTodo([FromBody] Todo newTodo)
        {
            context.Todos.Add(newTodo);
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTodo), new { id = newTodo.Id }, newTodo);
        }
        //Sets the todo with the id to the one from the frontend in the database
        [HttpPut("{id}")]
        public async Task<ActionResult> EditTodo(int id, [FromBody] Todo newTodo)
        {
            var todo = await context.Todos.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }
            todo.Name = newTodo.Name;
            todo.Description = newTodo.Description;
            todo.Urgency = newTodo.Urgency;
            todo.DueDate = newTodo.DueDate;
            await context.SaveChangesAsync();
            return NoContent();
        }
        //Deletes the todo with the id in the backend
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(int id)
        {
            var todo = await context.Todos.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }

            context.Todos.Remove(todo);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}
