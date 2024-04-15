using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InvoiceApp.Models;
using InvoiceApp.DTO;
using AutoMapper;

namespace InvoiceApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkOrdersController : ControllerBase
    {
        private readonly InvoiceContext _context;
        private readonly IMapper _mapper;

        public WorkOrdersController(InvoiceContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        private WorkOrderDTO WorkOrderToDTO([FromBody] WorkOrder workOrder)
        {
            var workOrderDTO = _mapper.Map<WorkOrderDTO>(workOrder);

            return workOrderDTO;
        }

        private WorkOrder WorkOrderFromDTO([FromBody] WorkOrderCreateDTO workOrderDTO)
        {
            var workOrder = _mapper.Map<WorkOrder>(workOrderDTO);

            return workOrder;
        } 
        
        // GET: api/WorkOrders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkOrderDTO>>> GetWorkOrders()
        {
            if (_context.WorkOrders == null)
            {
                return NotFound();
            }

            var workOrders = await _context.WorkOrders
                .Include(w => w.Departments)
                .ToListAsync();
            
            /*
             // Inital code below works, but replaced with  one-liner. 
            var workOrderDTOs = new List<WorkOrderDTO>();
            foreach (var workOrder in workOrders)
            {
                workOrderDTOs.Add(WorkOrderToDTO(workOrder));
            }*/

            // Thank you www.webdevtutor.net/blog/csharp-automapper-list-to-list
            List<WorkOrderDTO> workOrderDTOs = _mapper.Map<List<WorkOrderDTO>>(workOrders);
            return Ok(workOrderDTOs);

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

            if (workOrder != null && workOrder.DateCompleted == null) {
                workOrder.DateCompleted = DateTime.Now;
                _context.Update(workOrder);
                await _context.SaveChangesAsync();
            }
            else
            {
                return BadRequest("Work order has already been completed at time: " + workOrder.DateCompleted.ToString());
            }

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
