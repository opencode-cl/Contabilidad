using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Dapper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories
{
    public class LibroEsquematicoRepository : ILibroMayorEsquematicoRepository
    {

        private readonly InventoryDbContext _connectionManager;

        public LibroEsquematicoRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<IEnumerable<LibroMayorEsquematico.Cuenta>> LibroMayorEsquematicoData(int empresa, int periodo, int mes, int cuentaInicial, int cuentaFinal)
        {
            string query = @"SELECT c.codigo, c.nombre, MONTH(l.fecha) AS mes, SUM(l.debe) AS debito, SUM(l.haber) AS credito
                            FROM cuentas c
                            LEFT JOIN lineas l ON l.cuenta = c.codigo
                            WHERE l.periodo = @periodo
                              AND l.empresa = @empresa
                              AND l.cuenta BETWEEN @cuentaInicial AND @cuentaFinal
                              AND MONTH(l.fecha) <= @mes
                              AND l.norma < 3
                            GROUP BY c.codigo, mes
                            ORDER BY c.codigo, mes;";

            using(var db = _connectionManager.GetConnection())
            {
                var cuentas = await db.QueryAsync(query, new { empresa, periodo, mes, cuentaInicial, cuentaFinal});

                var groupedResults = cuentas.GroupBy(r => r.codigo)
                         .Select(cuentaGroup => new LibroMayorEsquematico.Cuenta
                         {
                             Codigo = cuentaGroup.Key,
                             Nombre = cuentaGroup.First().nombre,
                             lineasMensuales = cuentaGroup.GroupBy(aux => aux.mes)
                                                .Select(lineas => new LibroMayorEsquematico.Mensual
                                                {
                                                    Mes = lineas.Key,
                                                    Debito = lineas.First().debito,
                                                    Credito = lineas.First().credito,
                                                    Saldo = lineas.First().debito - lineas.First().credito,

                                                })
                                                .ToList()
                         });

                return groupedResults;

            }
        }
    }
}
