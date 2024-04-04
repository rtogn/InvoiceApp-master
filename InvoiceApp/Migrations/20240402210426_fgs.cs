using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InvoiceApp.Migrations
{
    public partial class fgs : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
        }
    }
}
