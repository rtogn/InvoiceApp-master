using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InvoiceApp.Models;
using InvoiceApp.DTO;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using FluentValidation;
using NuGet.Protocol.Core.Types;
using InvoiceApp.Exceptions;
using System.Diagnostics;
using Microsoft.Extensions.Logging;

namespace InvoiceApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkOrdersController : ControllerBase
    {
        private readonly InvoiceContext _context;
        private readonly IMapper _mapper;      
        private readonly IValidator<WorkOrderDepartmentsDTO> _workOrderDpeartmentsValidator;
        private readonly IValidator<WorkOrderCreateDTO> _workOrderCreateValidator;
        private readonly ILogger<WorkOrdersController> _logger;
        private readonly ILogger _factoryLogger;
        private readonly TokenManager _tokenService;
        public WorkOrdersController(
            ILogger<WorkOrdersController> logger,
            ILoggerFactory loggerFactory,
            InvoiceContext context, 
            IMapper mapper, 
            IValidator<WorkOrderDepartmentsDTO> workOrderDpeartmentsValidator,
            IValidator<WorkOrderCreateDTO> workOrderCreateValidator, 
            TokenManager tokenService
            )
            {
                _logger = logger;
                _factoryLogger = loggerFactory.CreateLogger("ExampleAccessLayer");
                _context = context;
                _mapper = mapper;
                _workOrderDpeartmentsValidator = workOrderDpeartmentsValidator;
                _workOrderCreateValidator = workOrderCreateValidator;
                _tokenService = tokenService;
            }

        private WorkOrderDTO WorkOrderToDTO(WorkOrder workOrder)
        {
            var workOrderDTO = _mapper.Map<WorkOrderDTO>(workOrder);

            return workOrderDTO;
        }

        private WorkOrder WorkOrderFromDTO(WorkOrderCreateDTO workOrderDTO)
        {
            var workOrder = _mapper.Map<WorkOrder>(workOrderDTO);

            return workOrder;
        }

        //[HttpPost("Authenticate")]
        //public IActionResult Authenticate([FromBody] User user)
        //{
        //    var timer = new Stopwatch();

        //    _logger.LogDebug("(LW) Authentication by {user.UserName}", user.UserName);
        //    timer.Start();

        //    // Hardcoded in place of server call
        //    string username_HC = "string";
        //    string password_HC = "string";

        //    if (user.UserName == username_HC && user.Password == password_HC)
        //    {
        //        var token = _tokenService.Authenticate(user.UserName);
        //        timer.Stop();
        //        _factoryLogger.LogDebug("(F) Authentication for {user} finished in {ticks} ticks", user, timer.ElapsedTicks);
        //        return Ok(new { Token = token });
        //    };
        //    _logger.LogInformation("User {user.UserName} failed to authenticate", user.UserName);
        //    return Unauthorized();
        //}

        // GET: api/WorkOrders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkOrderDTO>>> GetWorkOrders()
        {
            _logger.LogInformation("Get All Work Orders method envoked.");
            if (_context.WorkOrders == null)
            {
                _logger.LogWarning("WorkOrders table is null or empty. There should be information here");
                return NotFound();
            }

            var workOrders = await _context.WorkOrders
                .Include(w => w.Departments)
                .ToListAsync();
            List<WorkOrderDTO> workOrderDTOs = _mapper.Map<List<WorkOrderDTO>>(workOrders);
            return Ok(workOrderDTOs);

        }

        // GET: api/WorkOrders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WorkOrderDTO>> GetWorkOrder([FromRoute] int id)
        {
            // Demo ID for testing exceptions
            if (id == 511)
            {
                _logger.LogWarning("Description: 511 Demo log test" +
                    "\nTest: Test" +
                    "\nTest2: Test2");
                //throw new CustomException("Test"); //Exception("Custom Exception text!!!");
                return BadRequest();
            }
            if (_context.WorkOrders == null)
            {
                _logger.LogInformation("404 No found triggered");
                return NotFound();
            }
            _logger.LogDebug("Getting single WorkOrder in API for {id}", id);
            var workOrder = await _context.WorkOrders
                .Include(w => w.Departments)
                .FirstOrDefaultAsync(w => w.OrderId == id);

            if (workOrder == null)
            {
                _logger.LogWarning("No Work Order found for ID: {id}", id);
                return NotFound();
            }

            return WorkOrderToDTO(workOrder);
        }

        [HttpGet("Paged/")]
        public async Task<ActionResult<IEnumerable<WorkOrderDTO>>> GetWorkOrdersPagnated(int page = 1, int pageSize = 10)
        {
            if (_context.WorkOrders == null)
            {
                return NotFound();
            }
            var totalRecords = await _context.WorkOrders.CountAsync();
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

            var workOrders = await _context.WorkOrders
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            List<WorkOrderDTO> WorkOrderDTOs = _mapper.Map<List<WorkOrderDTO>>(workOrders);

            var response = new
            {
                Data = WorkOrderDTOs,
                Page = page,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = totalPages
            };

            return Ok(response);
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
            _logger.LogInformation("Workorder with ID of {id} was completed at given time of {dateCompleted.ToString()}", id, dateCompleted.ToString());
            return Ok(workOrderDto);
        }

        // PUT: api/WorkOrders/5
        [HttpPut("CompleteWorkOrder/{id}"), Authorize]
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
                _logger.LogDebug("Bad reuqest on CompelteWorkOrder() method with ID {id}", id);
                return BadRequest("Work order has already been completed at time: " + workOrder.DateCompleted.ToString());
            }

            var workOrderDto = WorkOrderToDTO(workOrder);
            return Ok(workOrderDto);
        }

        // PUT: api/WorkOrders/5
        [HttpPut("AddDepartmentToWorkOrder/{id}"), Authorize]
        public async Task<IActionResult> AddDepartmentToWorkOrder([FromRoute] int id, [FromBody] WorkOrderDepartmentsDTO workOrderDepartmentsDTO)
        {

            FluentValidation.Results.ValidationResult result = await _workOrderDpeartmentsValidator.ValidateAsync(workOrderDepartmentsDTO);
            if (!result.IsValid) {
                _logger.LogWarning("Invalid wwork order DTO sumbitted");
                return BadRequest("Invalid Work Order Data submitted"); } 

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
            FluentValidation.Results.ValidationResult result = await _workOrderCreateValidator.ValidateAsync(workOrderDto);
            if (!result.IsValid) { return BadRequest("A work order must have at least one valid department"); }

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
            _logger.LogTrace("WorkOrder with ID {id} delted from database", id);
            return NoContent();
        }

        private bool WorkOrderExists(int id)
        {
            return (_context.WorkOrders?.Any(e => e.OrderId == id)).GetValueOrDefault();
        }
    }
}
