namespace InvoiceApp.Exceptions
{
    public class CustomException : Exception
    {
        public string AdditionalInfo { get; set; }
        public string Type { get; set; }
        public string Detail { get; set; }
        public string Title { get; set; }
        public string Instance {  get; set; }
        public CustomException(string instance) 
        {
            Type = "My-BadRequest-Exception";
            Detail = "Custom Exception Detail! ";
            Title = "Custom Exception Title!";
            AdditionalInfo = "Submit a different ID";
            Instance = instance;
        }
    }
}
