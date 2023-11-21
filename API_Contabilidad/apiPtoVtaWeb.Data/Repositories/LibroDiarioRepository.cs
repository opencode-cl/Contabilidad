using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using ClosedXML.Excel;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories
{
    public class LibroDiarioRepository : ILibroDiarioRepository
    {
        private readonly InventoryDbContext _connectionManager;

        public LibroDiarioRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<byte[]> LibroDiario(int empresa, int periodo, DateTime fechaInicio, DateTime fechaFinal, bool resumido)
        {
            string query = "SELECT " +
                "folios.numero as numerof, " +
                "folios.tipo as tipof, " +
                "folios.nodocl as nodoclf, " +
                "folios.fecha as fechaf, " +
                "folios.glosa as glosaf, " +
                "folios.valor as valorf, " +
                "lineas.tipo, " +
                "lineas.numero, " +
                "lineas.fecha, " +
                "lineas.cuenta, " +
                "lineas.obra, " +
                "cuentas.nombre as ncuenta, " +
                "lineas.auxiliar, " +
                "lineas.td, " +
                "lineas.nodoc, " +
                "lineas.debe, " +
                "lineas.haber, " +
                "lineas.glosa, " +
                "lineas.nroref, " +
                "cuentas.tipo as codant, " +
                "COALESCE(tipoDocsNombreTDTD.nombre, tipoDocsNombreCuentaLibro.nombre) AS nombreTipoDoc " +
                "FROM lineas " +
                "LEFT JOIN tipoDocs AS tipoDocsNombreTDTD ON " +
                "lineas.td = tipoDocsNombreTDTD.codigo AND lineas.tipo = tipoDocsNombreTDTD.libro " +
                "LEFT JOIN tipoDocs AS tipoDocsNombreCuentaLibro ON " +
                "lineas.cuenta = tipoDocsNombreCuentaLibro.cuenta AND lineas.td = tipoDocsNombreCuentaLibro.codigo " +
                "INNER JOIN folios ON " +
                "lineas.periodo = folios.periodo and " +
                "lineas.empresa = folios.empresa and " +
                "lineas.tipo = folios.tipo and " +
                "lineas.numero = folios.numero " +
                "INNER JOIN cuentas ON " +
                "lineas.cuenta = cuentas.codigo " +
                "WHERE " +
                "lineas.periodo = @xperiodo and " +
                "lineas.empresa = @xempresa and " +
                "lineas.fecha >= @fechai and " +
                "lineas.fecha <= @fechat and " +
                "lineas.norma < 3 " +
                "ORDER BY lineas.fecha ASC, lineas.tipo ASC, lineas.numero ASC, lineas.lin ASC";

            string queryTotal = @"select sum(debe) as debitos, sum(haber) as creditos from lineas where 
	                             periodo  = @Periodo   and 
	                             empresa  = @Empresa   and 
	                             fecha    < @Fechai and lineas.norma < 3";

            string queryEmpresa = @"Select nombre from empresas WHERE codigo = @Codigo";


            int xperiodo = periodo;
            int xempresa = empresa;
            DateTime fechai = fechaInicio;
            DateTime fechat = fechaFinal;

            // Crear el libro de Excel
            var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Libro Diario");

            using (var db = _connectionManager.GetConnection())
            {

                var results = await db.QueryAsync<LibroDiario>(query, new { xperiodo, xempresa, fechai, fechat });
                int columnCount = results.First().GetType().GetProperties().Length;

                var totalesResults = await db.QueryFirstOrDefaultAsync<TotalesLibroDiario>(queryTotal, new { Periodo = xperiodo, Empresa = xempresa, Fechai = fechai });
                var nombreEmpresa = await db.QueryFirstOrDefaultAsync(queryEmpresa, new { Codigo = xempresa });

                worksheet.Column(1).Width = 10.71;
                worksheet.Column(2).Width = 5.71;
                worksheet.Column(3).Width = 10.71;
                worksheet.Column(4).Width = 10.71;
                worksheet.Column(5).Width = 40.71;
                worksheet.Column(6).Width = 13.71;
                worksheet.Column(7).Width = 30.71;
                worksheet.Column(8).Width = 18.71;
                worksheet.Column(9).Width = 13.71;
                worksheet.Column(10).Width = 13.71;
                worksheet.Column(11).Width = 60.71;
                worksheet.Column(12).Width = 13.71;
                worksheet.Column(13).Width = 13.71;
                worksheet.Column(14).Width = 13.71;

                worksheet.Column(1).Style.DateFormat.Format = "dd-MM-yyyy";

                worksheet.Cell(1, 1).Value = nombreEmpresa.nombre;
                worksheet.Cell(1, 1).Style.Font.Bold = true;

                worksheet.Row(3).Style.Font.Bold = true;
                worksheet.Row(3).Style.Font.FontSize = 22;
                worksheet.Cell(3, 6).Value = "LIBRO DIARIO DEL " + fechai.ToString("dd-MM-yyyy") + " AL " + fechat.ToString("dd-MM-yyyy");

                int row = 5;
                worksheet.Row(row).Style.Font.Bold = true;

                row = 6;
                int debeIndex = 0, haberIndex = 0;


                if (!resumido)
                {
                    worksheet.Cell(row, 1).Value = "Fecha";
                    worksheet.Cell(row, 2).Value = "T";
                    worksheet.Cell(row, 3).Value = "Compbte";
                    worksheet.Cell(row, 4).Value = "Cuenta";
                    worksheet.Cell(row, 5).Value = "Nombre";
                    worksheet.Cell(row, 6).Value = "Auxiliar";
                    worksheet.Cell(row, 7).Value = "TipoDoc";
                    worksheet.Cell(row, 8).Value = "NºDoc";
                    worksheet.Cell(row, 9).Value = "Debe";
                    worksheet.Cell(row, 10).Value = "Haber";
                    worksheet.Cell(row, 11).Value = "Glosa";
                    worksheet.Cell(row, 12).Value = "NroRef";
                    worksheet.Cell(row, 13).Value = "CtaRef";
                    worksheet.Cell(row, 14).Value = "Centro";
                    debeIndex = 9;
                    haberIndex = 10;
                }
                else
                {
                    worksheet.Cell(row, 1).Value = "Fecha";
                    worksheet.Cell(row, 2).Value = "T";
                    worksheet.Cell(row, 3).Value = "Compbte";
                    worksheet.Cell(row, 4).Value = "Cuenta";
                    worksheet.Cell(row, 5).Value = "Nombre";
                    worksheet.Cell(row, 6).Value = "Debe";
                    worksheet.Cell(row, 7).Value = "Haber";
                    worksheet.Cell(row, 8).Value = "Glosa";
                    debeIndex = 6;
                    haberIndex = 7;
                }

                worksheet.Cell(5, debeIndex-1).Value = "PERIODO ANTERIOR";
                worksheet.Cell(5, debeIndex).Value = totalesResults.Debitos;
                worksheet.Cell(5, haberIndex).Value = totalesResults.Creditos;

                worksheet.Column(debeIndex).Style.NumberFormat.Format = "#,##0";
                worksheet.Column(haberIndex).Style.NumberFormat.Format = "#,##0";
                // Set styles for headers
                worksheet.Row(row).Style.Font.FontSize = 10;
                worksheet.Row(row).Style.Font.Bold = true;

                if (!resumido)
                {
                    worksheet.Range(worksheet.Cell(row, 1), worksheet.Cell(row, 14)).Style.Font.Bold = true;
                    worksheet.Range(worksheet.Cell(row, 1), worksheet.Cell(row, 14)).Style.Font.FontColor = XLColor.White;
                    worksheet.Range(worksheet.Cell(row, 1), worksheet.Cell(row, 14)).Style.Fill.BackgroundColor = XLColor.FromTheme(XLThemeColor.Accent1);
                }
                else{
                    worksheet.Range(worksheet.Cell(row, 1), worksheet.Cell(row, 8)).Style.Font.Bold = true;
                    worksheet.Range(worksheet.Cell(row, 1), worksheet.Cell(row, 8)).Style.Font.FontColor = XLColor.White;
                    worksheet.Range(worksheet.Cell(row, 1), worksheet.Cell(row, 8)).Style.Fill.BackgroundColor = XLColor.FromTheme(XLThemeColor.Accent1);
                }



                // Llenar el archivo Excel con los datos de la consulta
                string fecha = "";
                int totalDiaDebe = 0, totalDiaHaber = 0, totalDebe = 0, totalHaber = 0;

                row = 7;
                foreach (var result in results)
                {   
                    if(row == 7)
                    {
                        fecha = result.Fecha.ToString("dd-MM-yyy");
                    }

                    if(fecha != result.Fecha.ToString("dd-MM-yyy"))
                    {
                        fecha = result.Fecha.ToString("dd-MM-yyy");

                        worksheet.Range(worksheet.Cell(row, 6), worksheet.Cell(row, 12)).Style.Font.Bold = true;

                        worksheet.Cell(row, debeIndex-1).Value = "TOTAL DÍA";
                        worksheet.Cell(row, debeIndex).Value = totalDiaDebe;
                        worksheet.Cell(row, haberIndex).Value = totalDiaHaber;

                        totalDebe = totalDebe + totalDiaDebe;
                        totalHaber = totalHaber + totalDiaHaber;
                        
                        totalDiaDebe = 0;
                        totalDiaHaber = 0;
                        row = row + 2;
                    }

                    totalDiaDebe = totalDiaDebe + result.Debe;
                    totalDiaHaber = totalDiaHaber + result.Haber;

                    if (!resumido)
                    {
                        worksheet.Cell(row, 1).Value = result.Fechaf.ToString("dd-MM-yyy");
                        worksheet.Cell(row, 2).Value = result.Tipof.ToString();
                        worksheet.Cell(row, 3).Value = result.Numerof.ToString();
                        worksheet.Cell(row, 4).Value = result.Cuenta.ToString();
                        worksheet.Cell(row, 5).Value = result.Ncuenta.ToString();
                        worksheet.Cell(row, 6).Value = result.Auxiliar.ToString();
                        worksheet.Cell(row, 7).Value = result.nombreTipoDoc == null? "" : result.nombreTipoDoc.ToString();
                        worksheet.Cell(row, 8).Value = result.Nodoc.ToString();
                        worksheet.Cell(row, 9).Value = result.Debe;
                        worksheet.Cell(row, 10).Value = result.Haber;
                        worksheet.Cell(row, 11).Value = result.Glosa.ToString();
                        worksheet.Cell(row, 12).Value = result.Nroref.ToString();
                        worksheet.Cell(row, 13).Value = result.Codant.ToString();
                        worksheet.Cell(row, 14).Value = result.Obra.ToString();
                    }
                    else
                    {
                        worksheet.Cell(row, 1).Value = result.Fechaf.ToString("dd-MM-yyy");
                        worksheet.Cell(row, 2).Value = result.Tipof.ToString();
                        worksheet.Cell(row, 3).Value = result.Numerof.ToString();
                        worksheet.Cell(row, 4).Value = result.Cuenta.ToString();
                        worksheet.Cell(row, 5).Value = result.Ncuenta.ToString();
                        worksheet.Cell(row, 6).Value = result.Debe;
                        worksheet.Cell(row, 7).Value = result.Haber;
                        worksheet.Cell(row, 8).Value = result.Glosa.ToString();
                    }


                    row++;
                }


                worksheet.Row(row).Style.Font.Bold = true;

                worksheet.Cell(row, debeIndex-1).Value = "TOTAL PERIODO";
                worksheet.Cell(row, debeIndex).Value = totalDebe;
                worksheet.Cell(row, haberIndex).Value = totalHaber;

                row = row + 2;

                worksheet.Row(row).Style.Font.Bold = true;

                worksheet.Cell(row, debeIndex - 1).Value = "TOTAL ACUMULADO";

                worksheet.Cell(row, debeIndex).Value = totalDebe + totalesResults.Debitos;
                worksheet.Cell(row, haberIndex).Value = totalHaber + totalesResults.Creditos;

                using (var stream = new System.IO.MemoryStream())
                {
                    workbook.SaveAs(stream);
                    return stream.ToArray();
                }
            }

        }

        public async Task<IEnumerable<LibroDiario>> LibroDiarioData(int empresa, int periodo, DateTime fechaInicio, DateTime fechaFinal){

            string query = "SELECT " +
                "folios.numero as numerof, " +
                "folios.tipo as tipof, " +
                "folios.nodocl as nodoclf, " +
                "folios.fecha as fechaf, " +
                "folios.glosa as glosaf, " +
                "folios.valor as valorf, " +
                "lineas.tipo, " +
                "lineas.numero, " +
                "lineas.fecha, " +
                "lineas.cuenta, " +
                "lineas.obra, " +
                "cuentas.nombre as ncuenta, " +
                "lineas.auxiliar, " +
                "lineas.td, " +
                "lineas.nodoc, " +
                "lineas.debe, " +
                "lineas.haber, " +
                "lineas.glosa, " +
                "lineas.nroref, " +
                "cuentas.tipo as codant, " +
                "COALESCE(tipoDocsNombreTDTD.nombre, tipoDocsNombreCuentaLibro.nombre) AS nombreTipoDoc " +
                "FROM lineas " +
                "LEFT JOIN tipoDocs AS tipoDocsNombreTDTD ON " +
                "lineas.td = tipoDocsNombreTDTD.codigo AND lineas.tipo = tipoDocsNombreTDTD.libro " +
                "LEFT JOIN tipoDocs AS tipoDocsNombreCuentaLibro ON " +
                "lineas.cuenta = tipoDocsNombreCuentaLibro.cuenta AND lineas.td = tipoDocsNombreCuentaLibro.codigo " +
                "INNER JOIN folios ON " +
                "lineas.periodo = folios.periodo and " +
                "lineas.empresa = folios.empresa and " +
                "lineas.tipo = folios.tipo and " +
                "lineas.numero = folios.numero " +
                "INNER JOIN cuentas ON " +
                "lineas.cuenta = cuentas.codigo " +
                "WHERE " +
                "lineas.periodo = @periodo and " +
                "lineas.empresa = @empresa and " +
                "lineas.fecha >= @fechaInicio and " +
                "lineas.fecha <= @fechaFinal and " +
                "lineas.norma < 3 " +
                "ORDER BY lineas.fecha ASC, lineas.tipo ASC, lineas.numero ASC, lineas.lin ASC";

            using (var db = _connectionManager.GetConnection())
            {
                return await db.QueryAsync<LibroDiario>(query, new { periodo, empresa, fechaInicio, fechaFinal });
            }
        }
        
    }
}
