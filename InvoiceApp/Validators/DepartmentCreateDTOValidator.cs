using FluentValidation;
using InvoiceApp.DTO;

namespace InvoiceApp.Validators
{
    public class DepartmentCreateDTOValidator : AbstractValidator<DepartmentCreateDTO>
    {
        public DepartmentCreateDTOValidator() 
        { 
            RuleFor(department => department.Name).NotEmpty().MinimumLength(3);
            RuleFor(department => department.ShortCode).MinimumLength(1);
        }
    }
}
