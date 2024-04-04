using Microsoft.EntityFrameworkCore.Design;
using InvoiceApp.Models;
using InvoiceApp;

void initDb()
{
    using (InvoiceContext _context = new InvoiceContext())
    {
        _context.Database.EnsureCreated();
    } 
}

initDb();
InvoiceContext _context = new InvoiceContext();



void createWorkOrder(string jobDescription, string facilityName, DateTime dateSubmitted, DateTime dateCompleted, List<Department>? Departments)
{
    var newWorkOrder = new WorkOrder { JobDescription = jobDescription, FacilityName = facilityName, DateCompleted = dateCompleted, DateSubmitted = dateSubmitted };
    
}

Department getDeptById(int deptId)
{
    var dept = _context.Departments.Find(deptId);
    return dept;
}

void addWorkOrderWithDepartments()
{
    var workOrder = new WorkOrder { JobDescription = "whoopwhoop3", FacilityName = "12345", DateSubmitted = new DateTime(1999, 12, 2), Departments = new List<Department> { } };//_context.WorkOrders.Find(orderId);
    var deptartment = getDeptById(1);

    if (workOrder != null && deptartment != null)
    {
        Console.WriteLine(workOrder.JobDescription);
        Console.WriteLine(deptartment.Name);
        workOrder.Departments.Add(deptartment);
        _context.WorkOrders.Add(workOrder);
    } else
    {
        Console.WriteLine("Was null");
    }

    _context.SaveChanges();
}


WorkOrder getWorkOrder(int id)
{
    return _context.WorkOrders.Find(id);
}