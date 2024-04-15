using AutoMapper;
using InvoiceApp.DTO;
using InvoiceApp.Models;

namespace InvoiceApp.MapperConfigs
{
    public class WorkOrderProfile : Profile
    {
        public WorkOrderProfile() 
        {
            SourceMemberNamingConvention = ExactMatchNamingConvention.Instance;
            DestinationMemberNamingConvention = ExactMatchNamingConvention.Instance;

            CreateMap<WorkOrder, WorkOrderDTO>()
                .ForMember(dest => dest.Departments , opt => opt.MapFrom(src => src.Departments.Select(d => d.Id).ToList()));

            //CreateMap<WorkOrder, WorkOrderDepartmentsDTO>()
            //    .ForMember(dest => dest.Departments, opt => opt.MapFrom(src => src.Departments.Select(d => d.Id).ToList()));
            
            CreateMap<WorkOrderCreateDTO, WorkOrder>()
                .ForMember(dest => dest.DateSubmitted, opt => opt.MapFrom(src => DateTime.Now))
                .ForMember(dest => dest.Departments, opt => opt.MapFrom(src => new List<Department>()));

        }
    }
}
