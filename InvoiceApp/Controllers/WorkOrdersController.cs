using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InvoiceApp.Models;
using InvoiceApp.DTO;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Azure.Identity;
using Microsoft.AspNetCore.Authorization;

namespace InvoiceApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkOrdersController : ControllerBase
    {
        private readonly InvoiceContext _context;
        private readonly IMapper _mapper;
        private readonly TokenManager _tokenService;

        public WorkOrdersController(InvoiceContext context, IMapper mapper, TokenManager tokenService)
        {
            _context = context;
            _mapper = mapper;
            _tokenService = tokenService;
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

        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] User user)
        {
            // Hardcoded in place of server call
            string username_HC = "string";
            string password_HC = "string";

            if (user.UserName == username_HC && user.Password == password_HC)
            {
                var token = _tokenService.Authenticate(user.UserName);
                return Ok(new { Token = token });
            };

            return Unauthorized();
        }

        // GET: api/WorkOrders
        [HttpGet, Authorize]
        public async Task<ActionResult<IEnumerable<WorkOrderDTO>>> GetWorkOrders()
        {
            if (_context.WorkOrders == null)
            {
                return NotFound();
            }

            var workOrders = await _context.WorkOrders
                .Include(w => w.Departments)
                .ToListAsync();
           
            // Thank you www.webdevtutor.net/blog/csharp-automapper-list-to-list
            List<WorkOrderDTO> workOrderDTOs = _mapper.Map<List<WorkOrderDTO>>(workOrders);
            return Ok(workOrderDTOs);

        }

        // GET: api/WorkOrders/5
        [HttpGet("{id}"), Authorize]
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
        [HttpPut("CompleteWorkOrderAtTime/{id}"), Authorize]
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
        [HttpPut("CompleteWorkOrder/{id}"), Authorize]
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
        [HttpPut("AddDepartmentToWorkOrder/{id}"), Authorize]
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
        [HttpPost("CreateWorkOrder"), Authorize]
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
        [HttpDelete("{id}"), Authorize]
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
