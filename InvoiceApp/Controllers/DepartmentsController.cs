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

namespace InvoiceApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        private readonly InvoiceContext _context;
        private readonly IMapper _mapper;
        public DepartmentsController(InvoiceContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        private DepartmentDTO DepartmentToDTO([FromBody] Department department)
        {
            var departmentDTO = _mapper.Map<DepartmentDTO>(department);

            return departmentDTO;
        }

        private Department DepartmentFromDTO([FromBody] DepartmentCreateDTO departmentDTO)
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

            /*
            return await _context.Departments
                .Select(d => DepartmentToDTO(d))
                .ToListAsync();*/
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

            if (department == null)
            {
                return NotFound();
            }

            var departmentDTO = DepartmentToDTO(department);
            return Ok(departmentDTO);
        }

        // PUT: api/Departments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> PutDepartment([FromRoute] int id,[FromBody] DepartmentCreateDTO departmentDTO)
        {
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
        [HttpPost, Authorize]
        public async Task<ActionResult<DepartmentCreateDTO>> PostDepartment([FromBody] DepartmentCreateDTO deparmentDTO)
        {
            var department = DepartmentFromDTO(deparmentDTO);
            if (_context.Departments == null)
            {
                return Problem("Entity set 'InvoiceContext.Departments'  is null.");
            }
            _context.Departments.Add(department);
            await _context.SaveChangesAsync();


            var departmentDTO = DepartmentToDTO(department);
            return Ok(departmentDTO);
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
