using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InvoiceApp.Migrations
{
    public partial class Many2ManyFix5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DepartmentWorkOrder_Departments_DepartmentsId",
                table: "DepartmentWorkOrder");

            migrationBuilder.DropForeignKey(
                name: "FK_DepartmentWorkOrder_WorkOrders_WorkOrdersOrderId",
                table: "DepartmentWorkOrder");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DepartmentWorkOrder",
                table: "DepartmentWorkOrder");

            migrationBuilder.RenameTable(
                name: "DepartmentWorkOrder",
                newName: "WorkOrderDepartments");

            migrationBuilder.RenameIndex(
                name: "IX_DepartmentWorkOrder_WorkOrdersOrderId",
                table: "WorkOrderDepartments",
                newName: "IX_WorkOrderDepartments_WorkOrdersOrderId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WorkOrderDepartments",
                table: "WorkOrderDepartments",
                columns: new[] { "DepartmentsId", "WorkOrdersOrderId" });

            migrationBuilder.AddForeignKey(
                name: "FK_WorkOrderDepartments_Departments_DepartmentsId",
                table: "WorkOrderDepartments",
                column: "DepartmentsId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WorkOrderDepartments_WorkOrders_WorkOrdersOrderId",
                table: "WorkOrderDepartments",
                column: "WorkOrdersOrderId",
                principalTable: "WorkOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkOrderDepartments_Departments_DepartmentsId",
                table: "WorkOrderDepartments");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkOrderDepartments_WorkOrders_WorkOrdersOrderId",
                table: "WorkOrderDepartments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WorkOrderDepartments",
                table: "WorkOrderDepartments");

            migrationBuilder.RenameTable(
                name: "WorkOrderDepartments",
                newName: "DepartmentWorkOrder");

            migrationBuilder.RenameIndex(
                name: "IX_WorkOrderDepartments_WorkOrdersOrderId",
                table: "DepartmentWorkOrder",
                newName: "IX_DepartmentWorkOrder_WorkOrdersOrderId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DepartmentWorkOrder",
                table: "DepartmentWorkOrder",
                columns: new[] { "DepartmentsId", "WorkOrdersOrderId" });

            migrationBuilder.AddForeignKey(
                name: "FK_DepartmentWorkOrder_Departments_DepartmentsId",
                table: "DepartmentWorkOrder",
                column: "DepartmentsId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DepartmentWorkOrder_WorkOrders_WorkOrdersOrderId",
                table: "DepartmentWorkOrder",
                column: "WorkOrdersOrderId",
                principalTable: "WorkOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
