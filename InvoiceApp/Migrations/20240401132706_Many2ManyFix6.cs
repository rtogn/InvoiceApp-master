using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InvoiceApp.Migrations
{
    public partial class Many2ManyFix6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WorkOrderDepartments");

            migrationBuilder.CreateTable(
                name: "WorkOrderDepartment",
                columns: table => new
                {
                    WorkOrderId = table.Column<int>(type: "int", nullable: false),
                    DepartmentId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkOrderDepartment", x => new { x.DepartmentId, x.WorkOrderId });
                    table.ForeignKey(
                        name: "FK_WorkOrderDepartment_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WorkOrderDepartment_WorkOrders_WorkOrderId",
                        column: x => x.WorkOrderId,
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
                name: "IX_WorkOrderDepartment_WorkOrderId",
                table: "WorkOrderDepartment",
                column: "WorkOrderId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WorkOrderDepartment");

            migrationBuilder.DeleteData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "WorkOrders",
                keyColumn: "OrderId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "WorkOrders",
                keyColumn: "OrderId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "WorkOrders",
                keyColumn: "OrderId",
                keyValue: 3);

            migrationBuilder.CreateTable(
                name: "WorkOrderDepartments",
                columns: table => new
                {
                    DepartmentsId = table.Column<int>(type: "int", nullable: false),
                    WorkOrdersOrderId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkOrderDepartments", x => new { x.DepartmentsId, x.WorkOrdersOrderId });
                    table.ForeignKey(
                        name: "FK_WorkOrderDepartments_Departments_DepartmentsId",
                        column: x => x.DepartmentsId,
                        principalTable: "Departments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WorkOrderDepartments_WorkOrders_WorkOrdersOrderId",
                        column: x => x.WorkOrdersOrderId,
                        principalTable: "WorkOrders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderDepartments_WorkOrdersOrderId",
                table: "WorkOrderDepartments",
                column: "WorkOrdersOrderId");
        }
    }
}
