using FluentValidation;
using InvoiceApp.DTO;

namespace InvoiceApp.Validators
{
    public class WorkOrderCreateDTOValidator : AbstractValidator<WorkOrderCreateDTO>
    {
        public WorkOrderCreateDTOValidator() 
        { 
            RuleFor(workOrder => workOrder.JobDescription).NotEmpty();
            RuleFor(workOrder => workOrder.FacilityName).NotEmpty();
            RuleFor(workOrder => workOrder.Departments).NotEmpty();
            RuleForEach(workOrder => workOrder.Departments).NotEmpty().GreaterThan(0);
        }
    }
}
