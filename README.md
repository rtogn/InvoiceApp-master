## Learning ASP.NET and EF Core by making a basic API

Includes EF Core Models, ASP.NET Controlers & DTOs for WorkOrder and Department entities arranged in a Many To Many Relationship

Intended to work with the Swagger API tool for testing the API directly.

### Lab Prompt: 
"The current scenario is as follows: The company needs a simple application to track facilities
(rooms) maintenance work orders. Each work order has a work order Id, a description of the job to
be performed, the facility name (e.g room 302, room 102, etc..), a date it was submitted and the
date it was completed. Each work order must have at least 1 shop/department like plumbing,
electrical, painting, etc. involved in accomplishing such maintenance orders. Assume that each
shop/department has an Id, a name, and a short code. e.g. (1, Plumbing, PL)
The task is to create a simple API to
  1) create a work order, with at least one shop assigned to,
  2) able to add additional shops to the work order,
  3) complete the work order.
  4) Query all orders or by work order Id.
  5) Be able to add shops/departments to the departments catalog (table).

### Additional Libraries used
The following Libraries were used as secondary requirements for the project
  1) AutoMapper - Library that manages mapping between Models and DTOs
  2) FluentValidation - Library to take care of validation of DTOs coming to the API

Technology used:
ASP.NET Core API, Entity Framework Core (code first) with migrations. SQL Server (localdb)
At the end, you should be able to demonstrate the API functionality using Swagger or POSTman."
