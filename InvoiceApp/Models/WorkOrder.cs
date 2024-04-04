namespace InvoiceApp.Models
{
    public class WorkOrder
    {
        public int OrderId { get; set; }
        public string JobDescription { get; set; }
        public string FacilityName { get; set; }
        public DateTime DateSubmitted { get; set; }
        public DateTime? DateCompleted { get; set; }
        public List<Department> Departments { get; set; } = new List<Department>();
    }
}
