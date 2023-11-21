using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model.QueryData;
using Dapper;
using DocumentFormat.OpenXml.Drawing.Diagrams;
using DocumentFormat.OpenXml.Drawing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories
{
    public class SaldosMensualesCuentaRepository : ISaldosMensualesCuentaRepository
    {

        private readonly InventoryDbContext _connectionManager;

        public SaldosMensualesCuentaRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<IEnumerable<SaldoMensualesCuenta>> SaldosMensualesCuentaData(int empresa, int periodo, int mes, int cuentaInicio, int cuentaFinal)
        {

            int days = DateTime.DaysInMonth(periodo, mes);

            DateTime fecha = new DateTime(periodo, mes, days);

            string query = @"SELECT c.grupo, cf.nombre as ngrupo, c.codigo, c.nombre, l.fecha, l.debe, l.haber 
                            FROM lineas l
                            INNER JOIN cuentas c ON l.cuenta = c.codigo
                            LEFT JOIN codfin cf ON c.codfin = cf.codigo
                            WHERE l.periodo = @Periodo
                              AND l.empresa = @Empresa
                              AND l.fecha <= @Fecha
                              AND l.norma < 3
                              AND c.codfin >= @Cuentai
                              AND c.codfin <= @Cuentaf
                            ORDER BY  c.grupo, c.codigo, l.cuenta, l.fecha;";

            using (var db = _connectionManager.GetConnection())
            {
                var lineas = await db.QueryAsync<SaldosMensualesLineas>(query, new { Periodo = periodo, Empresa = empresa, Cuentai = cuentaInicio, Cuentaf = cuentaFinal, Fecha = fecha });

                List<SaldoMensualesCuenta> saldoMensualesCuentas = new List<SaldoMensualesCuenta>();
                SaldoMensualesCuenta cuenta = new SaldoMensualesCuenta();
                cuenta.Cuenta = 0;

                foreach(SaldosMensualesLineas linea in lineas)
                {
                    if(linea.Codigo != cuenta.Cuenta)
                    {
                        saldoMensualesCuentas.Add(cuenta);
                        cuenta = new SaldoMensualesCuenta();
                        cuenta.Grupo = linea.Grupo;
                        cuenta.NGrupo = linea.NGrupo;
                        cuenta.Cuenta = linea.Codigo;
                        cuenta.NCuenta = linea.Nombre;
                    }

                    switch (linea.Fecha.Month)
                    {
                        case 1: // Enero
                            cuenta.Saldo01 += linea.Debe - linea.Haber;
                            break;
                        case 2: // Febrero
                            cuenta.Saldo02 += linea.Debe - linea.Haber;
                            break;
                        case 3: // Marzo
                            cuenta.Saldo03 += linea.Debe - linea.Haber;
                            break;
                        case 4: // Abril
                            cuenta.Saldo04 += linea.Debe - linea.Haber;
                            break;
                        case 5: // Mayo
                            cuenta.Saldo05 += linea.Debe - linea.Haber;
                            break;
                        case 6: // Junio
                            cuenta.Saldo06 += linea.Debe - linea.Haber;
                            break;
                        case 7: // Julio
                            cuenta.Saldo07 += linea.Debe - linea.Haber;
                            break;
                        case 8: // Agosto
                            cuenta.Saldo08 += linea.Debe - linea.Haber;
                            break;
                        case 9: // Septiembre
                            cuenta.Saldo09 += linea.Debe - linea.Haber;
                            break;
                        case 10: // Octubre
                            cuenta.Saldo10 += linea.Debe - linea.Haber;
                            break;
                        case 11: // Noviembre
                            cuenta.Saldo11 += linea.Debe - linea.Haber;
                            break;
                        case 12: // Diciembre
                            cuenta.Saldo12 += linea.Debe - linea.Haber;
                            break;
                        default:
                            break;
                    }

                }
                    saldoMensualesCuentas.RemoveAt(0);
                    return saldoMensualesCuentas;
                }
            }
        }
}
