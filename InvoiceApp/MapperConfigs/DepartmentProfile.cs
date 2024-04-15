using AutoMapper;
using InvoiceApp.DTO;
using InvoiceApp.Models;

namespace InvoiceApp.MapperConfigs
{
    public class DepartmentProfile : Profile
    {
        public DepartmentProfile() 
        {
            SourceMemberNamingConvention = ExactMatchNamingConvention.Instance;
            DestinationMemberNamingConvention = ExactMatchNamingConvention.Instance;

            CreateMap<Department, DepartmentDTO>();
            CreateMap<Department, DepartmentCreateDTO>();

        }  
        
    }
}
