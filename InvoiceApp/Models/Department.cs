using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace InvoiceApp.Models
{
    public class Department
    {
        public int Id {  get; set; }
        public String Name { get; set; }
        public string? ShortCode { get; set; }
        public List<WorkOrder> WorkOrders { get; set; }
    }
}
