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
using Microsoft.AspNetCore.Diagnostics;
using InvoiceApp.Controllers;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Logging.ClearProviders();
        builder.Logging.AddConsole();

        // Set up to write logs to Windows EventLog.
        // !! Run powershell command  New-EventLog -LogName Application -Source "Invoice App Demo" to view correctly. (admin mode)
        builder.Logging.AddEventLog(eLogSettiings =>
        {
            eLogSettiings.SourceName = "Invoice App Demo";
        });
        

        // Use built in ASP.net ProblemDetails with a custom exception
        builder.Services.AddProblemDetails(opt =>
        {
            opt.CustomizeProblemDetails = (ctx) =>
            {
                var exception = ctx.HttpContext.Features.Get<IExceptionHandlerFeature>()?.Error;
                if (ctx.ProblemDetails.Status == 500)
                {
                    ctx.ProblemDetails.Detail = "There was an internal server error, please contact the administrator. ";
                }
            };
        });

        /*
        // Add HTTP Logging 
        builder.Services.AddHttpLogging(logging =>
        {
            // Docs for fields to select:
            // https://bit.ly/aspnetcore6-httplogging
            logging.LoggingFields = HttpLoggingFields.All;
            logging.MediaTypeOptions.AddText("application/javascript");
            // Limit sizes of request/response bodies in logs
            logging.RequestBodyLogLimit = 4096;
            logging.ResponseBodyLogLimit = 4096;
            // Later: set up app.UseHttpLogging(); to enable. 
            // Also add "Microsoft.AspNeCore.HttpLogging" : "DesiredLogLevel (eg information)", to appsettings.json
        });

        // Add W3C logging (not normal to include this and HTTP at the same time). Logs storred in C:\Users\UseName\AppData\Local\logs
        var path = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        builder.Services.AddW3CLogging(opts =>
        {

            opts.LoggingFields = W3CLoggingFields.All;
            opts.FileSizeLimit = 5 * 1024 * 1024;
            opts.RetainedFileCountLimit = 2;
            opts.FileName = "InvoiceApp-W3C-Log";
            opts.LogDirectory = Path.Combine(path, "logs");
            opts.FlushInterval = TimeSpan.FromSeconds(2);
            // Later: set up app.UseW3CLogging(); to enable. 
        });
        */
        /*
        // Set yo Trace Listener for logging. Text file will be located in C:\Users\user\AppData\Local as a text file with the name declared by tracePath.
        var path = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        var tracePath = Path.Join(path, $"log_InvoiceApp_{DateTime.Now.ToString("yyyyMMdd-HHmm")}.txt");
        Trace.Listeners.Add(new TextWriterTraceListener(File.CreateText(tracePath)));
        Trace.AutoFlush = true;
        */
        //builder.Logging.AddFilter("InvoiceApp", logLevel.)

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
        // Set up for logging problem details to API caller on errors
       
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
                Type = SecuritySchemeType.ApiKey, 
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
          //.EnableSensitiveDataLogging()
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

        app.UseDefaultFiles();
        app.UseStaticFiles();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        else
        {
            app.UseExceptionHandler("/Home/Error");
            app.UseHsts();
        }
        // Logging settings
        app.UseExceptionHandler();

        app.UseHttpsRedirection();

        // Serve static files from the build directory of React App which in this case is InvoiceApp\frontend\build.
        //app.UseStaticFiles(new StaticFileOptions
        //{
        //    FileProvider = new PhysicalFileProvider(
        //        Path.Combine(builder.Environment.ContentRootPath, "frontend", "build")),
        //    RequestPath = ""
        //});

        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();
        app.MapFallbackToFile("/index.html");
        // If any unmatched routes are encounted ensure React handles routing and serves the index page. 
        //app.MapFallbackToFile("frontend/index.html");
        app.Run();
    }
}