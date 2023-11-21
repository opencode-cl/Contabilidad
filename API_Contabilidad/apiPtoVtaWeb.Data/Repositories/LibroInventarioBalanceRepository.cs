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
    public class LibroInventarioBalanceRepository : ILibroInventarioBalanceRepository
    {
        private readonly InventoryDbContext _connectionManager;

        public LibroInventarioBalanceRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<IEnumerable<LibroInventarioBalance.LIBCuenta>> LibroData(int empresa, int periodo, DateTime fechaCorte, int cuentaInicial, int cuentaFinal)
        {
            string query = @"
                            SELECT c.codigo AS CuentaCodigo, c.nombre AS CuentaNombre, c.grupo AS CuentaGrupo,
                                   l.debe, l.haber, nodoc,
                                   n.nombre AS AuxiliarNombre, n.codigo AS AuxiliarCodigo, n.dv AS AuxiliarDV
                            FROM cuentas c
                            LEFT JOIN lineas l ON c.codigo = l.cuenta
                            LEFT JOIN nombres n ON l.auxiliar = n.codigo
                            WHERE c.codigo >= @cuentaInicial 
                              AND c.codigo <= @cuentaFinal 
                              AND c.grupo < 3000 
                              AND l.periodo = @periodo
                              AND l.empresa = @empresa
                              AND l.fecha <= @fechaCorte
                              AND l.norma < 3
                            ORDER BY c.codigo, n.codigo, l.periodo, l.empresa, l.cuenta, l.auxiliar, l.nodoc";

            using (var db = _connectionManager.GetConnection())
            {
                var results =  await db.QueryAsync(query, new { periodo, empresa, fechaCorte, cuentaInicial, cuentaFinal});

                var groupedResults = results.GroupBy(r => r.CuentaCodigo)
                                         .Select(cuentaGroup => new LibroInventarioBalance.LIBCuenta
                                         {
                                             CuentaCodigo = cuentaGroup.Key,
                                             CuentaNombre = cuentaGroup.First().CuentaNombre,
                                             CuentaGrupo = cuentaGroup.First().CuentaGrupo,
                                             AuxiliarGroups = cuentaGroup.GroupBy(aux => aux.AuxiliarCodigo)
                                                                .Select(auxiliarGroup => new LibroInventarioBalance.LIBAuxiliar
                                                                {
                                                                    AuxiliarCodigo = auxiliarGroup.Key,
                                                                    AuxiliarNombre = auxiliarGroup.First().AuxiliarNombre,
                                                                    AuxiliarDV = auxiliarGroup.First().AuxiliarDV,
                                                                    Lineas = auxiliarGroup.Select(linea => new LibroInventarioBalance.LIBLinea
                                                                    {
                                                                        Debe = linea.debe,
                                                                        Haber = linea.haber,
                                                                        Nodoc = linea.nodoc
                                                                    }).ToList()
                                                                })
                                                                .ToList()
                                         })
                                         .ToList();

                return groupedResults;
            }
        }

    }
}
