using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InvoiceApp.Models;
using InvoiceApp.DTO;

namespace InvoiceApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkOrdersController : ControllerBase
    {
        private readonly InvoiceContext _context;

        public WorkOrdersController(InvoiceContext context)
        {
            _context = context;
        }
        private static WorkOrderDTO WorkOrderToDTO([FromBody] WorkOrder workOrder)
        {
            
            return new WorkOrderDTO
            {
                OrderId = workOrder.OrderId,
                JobDescription = workOrder.JobDescription,
                FacilityName = workOrder.FacilityName,
                DateSubmitted = workOrder.DateSubmitted,
                DateCompleted = workOrder.DateCompleted,
                Departments = workOrder.Departments.Select(d => d.Id).ToList()
            };
        }

        private static WorkOrder WorkOrderFromDTO([FromBody] WorkOrderCreateDTO workOrderDTO)
        {
            return new WorkOrder
            {
                JobDescription = workOrderDTO.JobDescription,
                FacilityName = workOrderDTO.FacilityName,
                DateSubmitted = DateTime.Now,
            };
        } 
        
        // GET: api/WorkOrders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkOrderDTO>>> GetWorkOrders()
        {
            if (_context.WorkOrders == null)
            {
                return NotFound();
            }
            return await _context.WorkOrders
                .Include(w => w.Departments)
                .Select(w => WorkOrderToDTO(w))
                .ToListAsync();
        }

        // GET: api/WorkOrders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WorkOrderDTO>> GetWorkOrder([FromRoute] int id)
        {
            if (_context.WorkOrders == null)
            {
                return NotFound();
            }
            var workOrder = await _context.WorkOrders
                .Include(w => w.Departments)
                .FirstOrDefaultAsync(w => w.OrderId == id);

            if (workOrder == null)
            {
                return NotFound();
            }

            return WorkOrderToDTO(workOrder);
        }

        // PUT: api/WorkOrders/5
        [HttpPut("CompleteWorkOrderAtTime/{id}")]
        public async Task<IActionResult> CompleteWorkOrderAtTime([FromRoute] int id, [FromBody] DateTime dateCompleted)
        {
            if (!WorkOrderExists(id)) { return NotFound(); }
            var workOrder = await _context.WorkOrders
                .FirstOrDefaultAsync(w => w.OrderId == id);

            workOrder.DateCompleted = dateCompleted;
            _context.Update(workOrder);
            await _context.SaveChangesAsync();

            var workOrderDto = WorkOrderToDTO(workOrder);
            return Ok(workOrderDto);
        }

        // PUT: api/WorkOrders/5
        [HttpPut("CompleteWorkOrder/{id}")]
        public async Task<IActionResult> CompleteWorkOrder([FromRoute] int id)
        {
            if (!WorkOrderExists(id)) { return NotFound(); }
            var workOrder = await _context.WorkOrders
                .FirstOrDefaultAsync(w => w.OrderId == id);

            workOrder.DateCompleted =  DateTime.Now;
            _context.Update(workOrder);
            await _context.SaveChangesAsync();

            var workOrderDto = WorkOrderToDTO(workOrder);
            return Ok(workOrderDto);
        }

        // PUT: api/WorkOrders/5
        [HttpPut("AddDepartmentToWorkOrder/{id}")]
        public async Task<IActionResult> AddDepartmentToWorkOrder([FromRoute] int id, [FromBody] WorkOrderDepartmentsDTO workOrderDepartmentsDTO)
        {
            if (!WorkOrderExists(id)) { return NotFound(); }
            
            var workOrder = await _context.WorkOrders
                .FirstOrDefaultAsync(w => w.OrderId == id);

            List<Department> departments = await _context.Departments
                .Where(d => workOrderDepartmentsDTO.Departments.Contains(d.Id))
                .ToListAsync();

            if (departments.Count == 0) { return BadRequest(); }

            foreach (var dept in departments)
            { 
                workOrder.Departments.Add(dept);
            }
            _context.Update(workOrder);
            await _context.SaveChangesAsync();
            WorkOrderDTO workOrderDTO = WorkOrderToDTO(workOrder);
            return Ok(workOrderDTO);
        }

        // POST: api/WorkOrders
        [HttpPost("CreateWorkOrder")]
        public async Task<ActionResult<WorkOrderCreateDTO>> CreateWorkOrder([FromBody] WorkOrderCreateDTO workOrderDto)
        {
            if (workOrderDto.Departments == null || workOrderDto.Departments.Count == 0) 
            { 
                return BadRequest("A work order must have at least one department");
            }

            WorkOrder workOrder = WorkOrderFromDTO(workOrderDto);

            await _context.WorkOrders.AddAsync(workOrder);
            await _context.SaveChangesAsync();

            var departments = await _context.Departments
                .Where(d => workOrderDto.Departments.Contains(d.Id))
                .ToListAsync();

            foreach (var dept in departments)
            {
                workOrder.Departments.Add(dept);
            }
            
            _context.Update(workOrder);
            await _context.SaveChangesAsync();

            WorkOrderDTO workOrderDTO = WorkOrderToDTO(workOrder);
            return Ok(workOrderDTO);
        }

        // DELETE: api/WorkOrders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkOrder([FromRoute] int id)
        {
            if (_context.WorkOrders == null)
            {
                return NotFound();
            }
            var workOrder = await _context.WorkOrders.FindAsync(id);
            if (workOrder == null)
            {
                return NotFound();
            }

            _context.WorkOrders.Remove(workOrder);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WorkOrderExists(int id)
        {
            return (_context.WorkOrders?.Any(e => e.OrderId == id)).GetValueOrDefault();
        }
    }
}
