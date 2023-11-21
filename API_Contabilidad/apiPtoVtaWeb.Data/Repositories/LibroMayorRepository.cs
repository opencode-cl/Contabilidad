using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using apiPtoVtaWeb.Model.QueryData;
using ClosedXML.Excel;
using Dapper;
using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.Wordprocessing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories
{
    public class LibroMayorRepository : ILibroMayorRepository
    {
        private readonly InventoryDbContext _connectionManager;

        public LibroMayorRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<byte[]> LibroMayor(int empresa, int periodo, int cuentaInicio, int cuentaFinal, DateTime fechaInicio, DateTime fechaFinal, bool IFRS)
        {
            string queryCuentas = @"SELECT C.codigo,
	                                    C.nombre,
                                           L.debitos,
                                           L.creditos
                                    FROM Cuentas C
                                    JOIN (
                                      SELECT SUM(debe) AS debitos, SUM(haber) AS creditos, cuenta
                                      FROM lineas
                                      WHERE periodo = @Periodo
                                        AND empresa = @Empresa
                                        AND fecha < @Fechai
                                        AND norma < 3
                                      GROUP BY cuenta
                                    ) L ON C.codigo = L.cuenta
                                    WHERE C.codigo BETWEEN @Cuentai AND @Cuentaf
                                    ORDER BY C.codigo;";

            string queryLineas = @"SELECT C.codigo, L.tipo, L.numero as folio, L.fecha, L.glosa, L.auxiliar as rut, N.nombre, L.nodoc, L.fedoc, L.debe, L.haber, L.feVen, L.obra, L.nroref
                                    FROM Cuentas C
                                    JOIN (
                                      SELECT *
                                      FROM lineas L
                                      WHERE L.periodo = @Periodo
                                        AND L.empresa = @Empresa
                                        AND L.fecha >= @Fechai
                                        AND L.fecha <= @Fechaf
                                        AND L.norma < 3
                                    ) L ON C.codigo = L.cuenta
                                    LEFT JOIN nombres N ON L.auxiliar = N.codigo
                                    WHERE C.codigo > @Cuentai AND C.codigo < @Cuentaf
                                    ORDER BY C.codigo, L.fecha, L.referencia;";

            string queryEmpresa = @"Select nombre from empresas WHERE codigo = @Codigo";

            // Crear el libro de Excel
            var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Libro Mayor");

            DateTime defaultDate = new DateTime(1, 1, 1);

            using (var db = _connectionManager.GetConnection())
            {

                var cuentas  = await db.QueryAsync<LibroMayorCuentas>(queryCuentas, new { Periodo = periodo, Empresa = empresa, Fechai = fechaInicio, Cuentai = cuentaInicio, Cuentaf = cuentaFinal });
                var lineas = await db.QueryAsync<LibroMayorLineas>(queryLineas, new { Periodo = periodo, Empresa = empresa, Fechai = fechaInicio, Fechaf = fechaFinal, Cuentai = cuentaInicio, Cuentaf = cuentaFinal });

                var nombreEmpresa = await db.QueryFirstOrDefaultAsync(queryEmpresa, new { Codigo = empresa });

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

                worksheet.Cell(1, 1).Value = nombreEmpresa.nombre;
                worksheet.Cell(1, 1).Style.Font.Bold = true;

                worksheet.Row(3).Style.Font.Bold = true;
                worksheet.Row(3).Style.Font.FontSize = 22;
                worksheet.Cell(3, 6).Value = "LIBRO MAYOR DEL " + fechaInicio.ToString("dd-MM-yyyy") + " AL " + fechaFinal.ToString("dd-MM-yyyy");

                int row = 5;
                worksheet.Row(row).Style.Font.Bold = true;

                row = 6;

                    worksheet.Cell(row, 1).Value = "TIPO";
                    worksheet.Cell(row, 2).Value = "FOLIO";
                    worksheet.Cell(row, 3).Value = "FECHA";
                    worksheet.Cell(row, 4).Value = "GLOSA";
                    worksheet.Cell(row, 5).Value = "RUT";
                    worksheet.Cell(row, 6).Value = "NOMBRE";
                    worksheet.Cell(row, 7).Value = "TIPODOC";
                    worksheet.Cell(row, 8).Value = "N°DOC";
                    worksheet.Cell(row, 9).Value = "FEDOC";
                    worksheet.Cell(row, 10).Value = "DEBE";
                    worksheet.Cell(row, 11).Value = "HABER";
                    worksheet.Cell(row, 12).Value = "SALDO";
                    worksheet.Cell(row, 13).Value = "VENCIM";
                    worksheet.Cell(row, 14).Value = "CENTRO";
                    worksheet.Cell(row, 15).Value = "NROREF";

                //worksheet.Column(debeIndex).Style.NumberFormat.Format = "#,##0";
                // worksheet.Column(haberIndex).Style.NumberFormat.Format = "#,##0";
                // Set styles for headers
                worksheet.Row(row).Style.Font.FontSize = 10;
                worksheet.Row(row).Style.Font.Bold = true;

                    worksheet.Range(worksheet.Cell(row, 1), worksheet.Cell(row, 15)).Style.Font.Bold = true;
                    worksheet.Range(worksheet.Cell(row, 1), worksheet.Cell(row, 15)).Style.Font.FontColor = XLColor.White;
                    worksheet.Range(worksheet.Cell(row, 1), worksheet.Cell(row, 15)).Style.Fill.BackgroundColor = XLColor.FromTheme(XLThemeColor.Accent1);

                row = row + 2;

                worksheet.Column(9).Style.NumberFormat.Format = "#,##0";
                worksheet.Column(10).Style.NumberFormat.Format = "#,##0";
                worksheet.Column(11).Style.NumberFormat.Format = "#,##0";

                foreach (LibroMayorCuentas cuenta in cuentas)
                {

                    worksheet.Range(worksheet.Cell(row, 1), worksheet.Cell(row, 11)).Style.Font.Bold = true;
                    worksheet.Range(worksheet.Cell(row, 5), worksheet.Cell(row, 11)).Style.Font.FontColor = XLColor.White;
                    worksheet.Range(worksheet.Cell(row, 5), worksheet.Cell(row, 11)).Style.Fill.BackgroundColor = XLColor.FromTheme(XLThemeColor.Accent1);

                    worksheet.Cell(row, 1).Value = cuenta.Codigo;
                    worksheet.Cell(row, 2).Value = cuenta.Nombre;
                    worksheet.Cell(row, 5).Value = "DEL PERIODO ANTERIOR:";
                    worksheet.Cell(row, 9).Value = cuenta.Debitos;
                    worksheet.Cell(row, 10).Value = cuenta.Creditos;
                    worksheet.Cell(row, 11).Value = cuenta.Debitos - cuenta.Creditos;

                    long saldo = cuenta.Debitos - cuenta.Creditos;

                    var filteredLineas = lineas.Where(linea => linea.Codigo == cuenta.Codigo);
                    long debeCuenta = 0, haberCuenta = 0;

                    foreach(LibroMayorLineas linea in filteredLineas)
                    {
                        row++;
                        saldo = saldo + linea.Debe - linea.Haber;

                        if(saldo < 0)
                        {
                            worksheet.Cell(row, 12).Style.Font.FontColor = XLColor.Red;
                        }
                        else
                        {
                            worksheet.Cell(row, 12).Style.Font.FontColor = XLColor.Black;
                        }

                        worksheet.Cell(row, 1).Value = linea.Tipo;
                        worksheet.Cell(row, 2).Value = linea.Folio;
                        worksheet.Cell(row, 3).Value = linea.Fecha;
                        worksheet.Cell(row, 4).Value = linea.Glosa;
                        worksheet.Cell(row, 5).Value = linea.Rut;
                        worksheet.Cell(row, 6).Value = linea.Nombre;

                        worksheet.Cell(row, 8).Value = linea.Nodoc;
                        worksheet.Cell(row, 9).Value = linea.Fedoc != defaultDate ? linea.Fedoc.ToString("dd-MM-yyyy") : "";
                        worksheet.Cell(row, 10).Value = linea.Debe;
                        worksheet.Cell(row, 11).Value = linea.Haber;
                        worksheet.Cell(row, 12).Value = saldo > 0 ? saldo : "("+Math.Abs(saldo)+")";
                        worksheet.Cell(row, 13).Value = linea.Feven != defaultDate ? linea.Feven.ToString("dd-MM-yyyy") : "";
                        worksheet.Cell(row, 14).Value = linea.Obra;
                        worksheet.Cell(row, 15).Value = linea.Nroref;

                        debeCuenta = debeCuenta + linea.Debe;
                        haberCuenta = haberCuenta + linea.Haber;

                    }

                    row = row + 2;

                    worksheet.Range(worksheet.Cell(row, 1), worksheet.Cell(row, 11)).Style.Font.Bold = true;
                    worksheet.Range(worksheet.Cell(row, 5), worksheet.Cell(row, 11)).Style.Font.FontColor = XLColor.White;
                    worksheet.Range(worksheet.Cell(row, 5), worksheet.Cell(row, 11)).Style.Fill.BackgroundColor = XLColor.FromTheme(XLThemeColor.Accent1);

                    worksheet.Cell(row, 5).Value = "DEL PERIODO:";
                    worksheet.Cell(row, 9).Value = debeCuenta;
                    worksheet.Cell(row, 10).Value = haberCuenta;

                    row = row + 1;

                    worksheet.Range(worksheet.Cell(row, 1), worksheet.Cell(row, 11)).Style.Font.Bold = true;
                    worksheet.Range(worksheet.Cell(row, 5), worksheet.Cell(row, 11)).Style.Font.FontColor = XLColor.White;
                    worksheet.Range(worksheet.Cell(row, 5), worksheet.Cell(row, 11)).Style.Fill.BackgroundColor = XLColor.FromTheme(XLThemeColor.Accent1);

                    worksheet.Cell(row, 5).Value = "AL PERIODO SIGUIENTE:";
                    worksheet.Cell(row, 9).Value = cuenta.Debitos + debeCuenta;
                    worksheet.Cell(row, 10).Value = cuenta.Creditos + haberCuenta;
                    worksheet.Cell(row, 11).Value = (cuenta.Debitos + debeCuenta) - (cuenta.Creditos + haberCuenta);

                    row = row + 2;
                }

                using (var stream = new System.IO.MemoryStream())
                {
                    workbook.SaveAs(stream);
                    return stream.ToArray();
                }
            }

        }

        public async Task<IEnumerable<LibroMayor>> LibroMayorData(int empresa, int periodo, int cuentaInicio, int cuentaFinal, DateTime fechaInicio, DateTime fechaFinal, bool IFRS)
        {
            string queryCuentas = @"SELECT C.codigo,
	                                    C.nombre,
                                           L.debitos,
                                           L.creditos
                                    FROM Cuentas C
                                    JOIN (
                                      SELECT SUM(debe) AS debitos, SUM(haber) AS creditos, cuenta
                                      FROM lineas
                                      WHERE periodo = @Periodo
                                        AND empresa = @Empresa
                                        AND fecha < @Fechai
                                        AND norma < 3
                                      GROUP BY cuenta
                                    ) L ON C.codigo = L.cuenta
                                    WHERE C.codigo BETWEEN @Cuentai AND @Cuentaf
                                    ORDER BY C.codigo;";

            string queryLineas = @"SELECT C.codigo, L.tipo, L.numero as folio, L.fecha, L.glosa, L.auxiliar as rut, N.nombre, L.nodoc, L.fedoc, L.debe, L.haber, L.feVen, L.obra, L.nroref
                                    FROM Cuentas C
                                    JOIN (
                                      SELECT *
                                      FROM lineas L
                                      WHERE L.periodo = @Periodo
                                        AND L.empresa = @Empresa
                                        AND L.fecha >= @Fechai
                                        AND L.fecha <= @Fechaf
                                        AND L.norma < 3
                                    ) L ON C.codigo = L.cuenta
                                    LEFT JOIN nombres N ON L.auxiliar = N.codigo
                                    WHERE C.codigo > @Cuentai AND C.codigo < @Cuentaf
                                    ORDER BY C.codigo, L.fecha, L.referencia;";

            using (var db = _connectionManager.GetConnection())
            {

                var cuentas = await db.QueryAsync<LibroMayorCuentas>(queryCuentas, new { Periodo = periodo, Empresa = empresa, Fechai = fechaInicio, Cuentai = cuentaInicio, Cuentaf = cuentaFinal });
                var lineas = await db.QueryAsync<LibroMayorLineas>(queryLineas, new { Periodo = periodo, Empresa = empresa, Fechai = fechaInicio, Fechaf = fechaFinal, Cuentai = cuentaInicio, Cuentaf = cuentaFinal });

                List<LibroMayor> LibroMayorData = new List<LibroMayor>();

                foreach(LibroMayorCuentas cuenta in cuentas)
                {
                    LibroMayor libroMayor = new LibroMayor();
                    libroMayor.Cuenta = cuenta;

                    var filteredLineas = lineas.Where(linea => linea.Codigo == cuenta.Codigo);

                    libroMayor.Lineas = filteredLineas;

                    LibroMayorData.Add(libroMayor);
                    
                }

                return LibroMayorData;
            }
        }
    }
}
