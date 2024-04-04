namespace InvoiceApp.DTO
{
    public class WorkOrderCreateDTO 
    {
        public string JobDescription { get; set; }
        public string FacilityName { get; set; }
        public List<int> Departments { get; set; }
    }
}
