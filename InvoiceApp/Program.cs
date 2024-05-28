using InvoiceApp;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using AutoMapper;
using InvoiceApp.MapperConfigs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using InvoiceApp.Validators;
using FluentValidation;
using InvoiceApp.DTO;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var config = new MapperConfiguration(cfg => {
            cfg.AddProfile<WorkOrderProfile>();
            cfg.AddProfile<DepartmentProfile>();
        });

        IMapper mapper = config.CreateMapper();

        // User Secrets
        // keeping out check for 'IsDevelopment' for now
        builder.Configuration.AddUserSecrets<Program>();

        // Add services to the container.
        builder.Services.AddControllers()
          .AddJsonOptions(opt => opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();

        // Add authorization option/button to swagger UI
        builder.Services.AddSwaggerGen(opt => {
            opt.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "InvoiceAPI",
                Version = "B1.0"
            });
            opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter token",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "bearer"
            });

            opt.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
          new OpenApiSecurityScheme {
            Reference = new OpenApiReference {
              Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
            }
          },
          new string[] {}
        }
      });
        });

        builder.Services.AddDbContext<InvoiceContext>(
          opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("InvoiceConnection"))
          .EnableSensitiveDataLogging()
          .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking));
        builder.Services.AddAutoMapper(typeof(WorkOrderProfile).Assembly);

        builder.Services.AddScoped<IValidator<WorkOrderDepartmentsDTO>, WorkOrderDepartmentsDTOValidator>();
        builder.Services.AddScoped<IValidator<WorkOrderCreateDTO>, WorkOrderCreateDTOValidator>();
        builder.Services.AddScoped<IValidator<DepartmentCreateDTO>, DepartmentCreateDTOValidator>();

        builder.Services.AddAuthentication(options => {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
          .AddJwtBearer(options => {
              var jwtKey = builder.Configuration["SecretKey"];
              options.RequireHttpsMetadata = false;
              options.SaveToken = true;
              options.TokenValidationParameters = new TokenValidationParameters
              {
                  ValidateIssuerSigningKey = true,
                  IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                  ValidateIssuer = false,
                  ValidateAudience = false,
                  RequireExpirationTime = false,
                  ValidateLifetime = true
              };
          });
        // Fluent Validation Classes


        // Token manager Class
        builder.Services.AddSingleton<TokenManager>();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();

        }

        app.UseHttpsRedirection();
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}