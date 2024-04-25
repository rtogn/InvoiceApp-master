using InvoiceApp;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using AutoMapper;
using InvoiceApp.Models;
using InvoiceApp.DTO;
using InvoiceApp.MapperConfigs;
using InvoiceApp.Validators;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

var config = new MapperConfiguration(cfg =>
{
    cfg.AddProfile<WorkOrderProfile>();
    cfg.AddProfile<DepartmentProfile>();
});

IMapper mapper = config.CreateMapper();

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(opt=> opt.JsonSerializerOptions.ReferenceHandler=ReferenceHandler.IgnoreCycles);


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<InvoiceContext>(
    opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("InvoiceConnection"))
    .EnableSensitiveDataLogging()
    .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking));
builder.Services.AddAutoMapper(typeof(WorkOrderProfile).Assembly); //, typeof(DepartmentProfile).Assembly);

builder.Services.AddScoped<IValidator<WorkOrderDepartmentsDTO>, WorkOrderDepartmentsDTOValidator>();
builder.Services.AddScoped<IValidator<WorkOrderCreateDTO>, WorkOrderCreateDTOValidator>();
builder.Services.AddScoped<IValidator<DepartmentCreateDTO>, DepartmentCreateDTOValidator>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
   
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
