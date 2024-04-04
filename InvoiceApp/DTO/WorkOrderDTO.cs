using InvoiceApp.Models;

namespace InvoiceApp.DTO
{
    public class WorkOrderDTO
    {
        public int OrderId { get; set; }
        public string JobDescription { get; set; }
        public string FacilityName { get; set; }
        public DateTime DateSubmitted { get; set; }
        public DateTime? DateCompleted { get; set; }
        public List<int> Departments { get; set; }

    }
}
