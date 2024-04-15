using Microsoft.EntityFrameworkCore;
using InvoiceApp.Models;
using NuGet.Common;
using LogLevel = Microsoft.Extensions.Logging.LogLevel;

namespace InvoiceApp
{
    public class InvoiceContext :DbContext
    {
        public DbSet<WorkOrder> WorkOrders { get; set; }
        public DbSet<Department> Departments { get; set; }

        public InvoiceContext(DbContextOptions<InvoiceContext> options) 
            : base(options) 
        { 
        
        }

        public InvoiceContext()
        {
        }

       /*
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(
              "Data Source = (localdb)\\MSSQLLocalDB; Initial Catalog = InvoiceDatabase"
            ).LogTo(Console.WriteLine,
                    new[] { DbLoggerCategory.Database.Command.Name },
                    LogLevel.Information)
            .EnableSensitiveDataLogging();
        }*/
       

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<WorkOrder>()
                .HasKey(e => e.OrderId);

            modelBuilder.Entity<WorkOrder>()
                .HasMany(w => w.Departments)
                .WithMany(d => d.WorkOrders);

            //modelBuilder.Entity<WorkOrder>()
            //    .HasIndex(p => p.JobDescription).IsUnique();

            //modelBuilder.Entity<Department>()
            //    .HasIndex(p => p.Name).IsUnique();


            modelBuilder.Entity<Department>()
                .HasMany(d => d.WorkOrders)
                .WithMany(w => w.Departments);

            /*
           modelBuilder.Entity<WorkOrder>()
               .Property(p => p.OrderId)
               .ValueGeneratedOnAdd();
           */

            modelBuilder.Entity<Department>()
            .HasIndex(p => p.ShortCode).IsUnique();
            
            
            modelBuilder.Entity<Department>()
                .Property(p => p.Id)
                .ValueGeneratedOnAdd();
            
            var dummyDepartments = new Department[]
            {
                new Department { Id=1, Name="Pizza Department", WorkOrders=new List<WorkOrder> { } },
                new Department { Id=2, Name="Pasta Deparment"},
                new Department { Id=3, Name="Pastrami Department" }
            };
            modelBuilder.Entity<Department>().HasData(dummyDepartments);

            var dummyWorkOrders = new WorkOrder[]
            {
                new WorkOrder { OrderId=1, JobDescription="Sauce Man", FacilityName="Pizza Land", DateSubmitted=new DateTime(2024, 2, 1), Departments=new List<Department> { } },
                new WorkOrder { OrderId=2, JobDescription="Cheese Leutenant", FacilityName="Pasta Planet", DateSubmitted=new DateTime(2024, 1, 5), Departments=new List<Department> { } },
                new WorkOrder { OrderId=3, JobDescription="Deli Meat Inspector", FacilityName="Sub Galaxy", DateSubmitted=new DateTime(2024, 1, 1), Departments=new List<Department> { } }
            };
            modelBuilder.Entity<WorkOrder>().HasData(dummyWorkOrders);
            
        }

    }
}
