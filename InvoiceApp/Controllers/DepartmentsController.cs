using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InvoiceApp.Models;
using InvoiceApp.DTO;
using AutoMapper;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Authorization;
using FluentValidation;
using Newtonsoft.Json;
using System.Net;
using System.Text;
using NuGet.Versioning;


namespace InvoiceApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        private readonly InvoiceContext _context;
        private readonly IMapper _mapper;
        private readonly IValidator<DepartmentCreateDTO> _departmentCreateValidator;
        public DepartmentsController(InvoiceContext context, IMapper mapper, IValidator<DepartmentCreateDTO> departmentCreateValidator)
        {
            _context = context;
            _mapper = mapper;
            _departmentCreateValidator = departmentCreateValidator;
        }

        private DepartmentDTO DepartmentToDTO(Department department)
        {
            var departmentDTO = _mapper.Map<DepartmentDTO>(department);

            return departmentDTO;
        }

        private Department DepartmentFromDTO(DepartmentCreateDTO departmentDTO)
        {
            var department = _mapper.Map<Department>(departmentDTO);

            return department;
        }

        // GET: api/Departments
        [HttpGet, Authorize]
        public async Task<ActionResult<IEnumerable<DepartmentDTO>>> GetDepartments()
        {
            if (_context.Departments == null)
            {
                return NotFound();
            }
            var departments = await _context.Departments.ToListAsync();

            List<DepartmentDTO> DepartmentDTOs = _mapper.Map<List<DepartmentDTO>>(departments);

            return Ok(DepartmentDTOs);
        }

        // GET: api/Departments/Paged?page=1&pageSize=10
        //        [HttpPut("CompleteWorkOrderAtTime/{id}"), Authorize]
        [HttpGet("Paged/")]
        public async Task<ActionResult<IEnumerable<DepartmentDTO>>> GetDepartmentsPagnated(int page = 1, int pageSize = 10)
        {
            if (_context.Departments == null)
            {
                return NotFound();
            }
            var totalRecords = await _context.Departments.CountAsync();
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

            var departments = await _context.Departments
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            List<DepartmentDTO> DepartmentDTOs = _mapper.Map<List<DepartmentDTO>>(departments);

            var response = new
            {
                Data = DepartmentDTOs,
                Page = page,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = totalPages
            };

            return Ok(response);
        }

        // GET: api/Departments/5
        [HttpGet("{id}"), Authorize]
        public async Task<ActionResult<DepartmentDTO>> GetDepartment([FromRoute] int id)
        {
          if (_context.Departments == null)
          {
              return NotFound();
          }
            var department = await _context.Departments.FindAsync(id);
            //await _context.Departments.Where(i => i.Name == name && i.ShortCode == shortCode).ToListAsync();

            if (department == null)
            {
                return NotFound();
            }

            var departmentDTO = DepartmentToDTO(department);
            return Ok(departmentDTO);
        }

        // PUT: api/Departments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDepartment([FromRoute] int id,[FromBody] DepartmentCreateDTO departmentDTO)
        {
            FluentValidation.Results.ValidationResult result = await _departmentCreateValidator.ValidateAsync(departmentDTO);
            if (!result.IsValid) { return BadRequest("Invalid department submitted. Name must be more than 2 characters."); }

            if (!DepartmentExists(id)) { return NotFound(); }

            Department department = await _context.Departments
                .FirstOrDefaultAsync(d => d.Id == id);

            department.Name = departmentDTO.Name;
            department.ShortCode = departmentDTO.ShortCode;

            _context.Entry(department).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DepartmentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(departmentDTO);
        }

        // POST: api/Departments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DepartmentCreateDTO>> PostDepartment([FromBody] DepartmentCreateDTO departmentDTO_in)
        {
            FluentValidation.Results.ValidationResult result = await _departmentCreateValidator.ValidateAsync(departmentDTO_in);
            if (!result.IsValid) { return BadRequest("Invalid department submitted. Name must be more than 2 characters."); }

            var department = DepartmentFromDTO(departmentDTO_in);
            if (_context.Departments == null)
            {
                return Problem("Entity set 'InvoiceContext.Departments'  is null.");
            }
            _context.Departments.Add(department);
            await _context.SaveChangesAsync();


            var departmentDTO_out = DepartmentToDTO(department);
            return Ok(departmentDTO_out);
        }

        // DELETE: api/Departments/5
        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteDepartment([FromRoute] int id)
        {
            if (_context.Departments == null)
            {
                return NotFound();
            }
            var department = await _context.Departments.FindAsync(id);
            if (department == null)
            {
                return NotFound();
            }

            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DepartmentExists(int id)
        {
            return (_context.Departments?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
