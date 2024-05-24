using FluentValidation;
using InvoiceApp.DTO;

namespace InvoiceApp.Validators
{
    public class WorkOrderDepartmentsDTOValidator : AbstractValidator<WorkOrderDepartmentsDTO>
    {
        public WorkOrderDepartmentsDTOValidator() 
        {
            RuleForEach(workOrder => workOrder.Departments).NotEmpty().NotEqual(0);
        }
    }
}
