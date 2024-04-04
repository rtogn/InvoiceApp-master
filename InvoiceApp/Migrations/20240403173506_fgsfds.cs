using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InvoiceApp.Migrations
{
    public partial class fgsfds : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WorkOrderDepartment");

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

            migrationBuilder.CreateIndex(
                name: "IX_DepartmentWorkOrder_WorkOrdersOrderId",
                table: "DepartmentWorkOrder",
                column: "WorkOrdersOrderId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DepartmentWorkOrder");

            migrationBuilder.CreateTable(
                name: "WorkOrderDepartment",
                columns: table => new
                {
                    DepartmentId = table.Column<int>(type: "int", nullable: false),
                    WorkOrderId = table.Column<int>(type: "int", nullable: false)
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

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderDepartment_WorkOrderId",
                table: "WorkOrderDepartment",
                column: "WorkOrderId");
        }
    }
}
