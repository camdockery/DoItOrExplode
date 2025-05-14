using DoItOrExplode.Server.Models;
using DoItOrExplode.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        [HttpGet]
        public async Task<ActionResult<Todo>> GetTodos()
        {
            var todos = await context.Todos.ToListAsync();
            return Ok(todos);
        }

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
