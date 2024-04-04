using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InvoiceApp.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ShortCode = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WorkOrders",
                columns: table => new
                {
                    OrderId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    JobDescription = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FacilityName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateSubmitted = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateCompleted = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkOrders", x => x.OrderId);
                });

            migrationBuilder.CreateTable(
                name: "DepartmentWorkOrder",
                columns: table => new
                {
                    DepartmentsId = table.Column<int>(type: "int", nullable: false),
                    WorkOrdersOrderId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DepartmentWorkOrder", x => new { x.DepartmentsId, x.WorkOrdersOrderId });
                    table.ForeignKey(
                        name: "FK_DepartmentWorkOrder_Departments_DepartmentsId",
                        column: x => x.DepartmentsId,
                        principalTable: "Departments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DepartmentWorkOrder_WorkOrders_WorkOrdersOrderId",
                        column: x => x.WorkOrdersOrderId,
                        principalTable: "WorkOrders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Departments",
                columns: new[] { "Id", "Name", "ShortCode" },
                values: new object[,]
                {
                    { 1, "Pizza Department", null },
                    { 2, "Pasta Deparment", null },
                    { 3, "Pastrami Department", null }
                });

            migrationBuilder.InsertData(
                table: "WorkOrders",
                columns: new[] { "OrderId", "DateCompleted", "DateSubmitted", "FacilityName", "JobDescription" },
                values: new object[,]
                {
                    { 1, null, new DateTime(2024, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Pizza Land", "Sauce Man" },
                    { 2, null, new DateTime(2024, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Pasta Planet", "Cheese Leutenant" },
                    { 3, null, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sub Galaxy", "Deli Meat Inspector" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Departments_Name",
                table: "Departments",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Departments_ShortCode",
                table: "Departments",
                column: "ShortCode",
                unique: true,
                filter: "[ShortCode] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_DepartmentWorkOrder_WorkOrdersOrderId",
                table: "DepartmentWorkOrder",
                column: "WorkOrdersOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_JobDescription",
                table: "WorkOrders",
                column: "JobDescription",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DepartmentWorkOrder");

            migrationBuilder.DropTable(
                name: "Departments");

            migrationBuilder.DropTable(
                name: "WorkOrders");
        }
    }
}
