using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using apiPtoVtaWeb.Model.QueryData;
using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories
{
    public class Balance8ColumnasRepository : IBalance8ColumnasRepository
    {
        private readonly InventoryDbContext _connectionManager;
        public Balance8ColumnasRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<IEnumerable<Balance8Columnas>> BalanceData(int empresa, int periodo, DateTime fechaCorte, bool Acumulado, bool IFRS   )
        {
            string query;
            if (Acumulado){
                query = @"SELECT cuentas.codigo AS codigo,
			                cuentas.nombre AS nombre,
			                cuentas.grupo  AS grupo,
				            lineas.codigocp,
			                SUM(debe)      AS debitos,
			                SUM(haber)     AS creditos
						FROM cuentas,lineas
                        WHERE
				            cuentas.codigo=lineas.cuenta AND
				            lineas.empresa= @Empresa AND
                            lineas.periodo= @Periodo AND
                            lineas.fecha <= @FechaCorte AND 
                            lineas.norma < 3
                            GROUP BY codigo
					        ORDER BY grupo, codigo ASC";

            }
            else{
                query = @"SELECT cuentas.codigo AS codigo,
			                cuentas.nombre AS nombre,
			                cuentas.grupo  AS grupo,
				            lineas.codigocp,
			                SUM(debe)      AS debitos,
			                SUM(haber)     AS creditos
						FROM cuentas,lineas
                        WHERE
				            cuentas.codigo=lineas.cuenta AND
				            lineas.empresa= @Empresa AND
                            lineas.periodo= @Periodo AND
                            lineas.fecha <= @FechaCorte AND
                            MONTH(lineas.fecha) = MONTH(@FechaCorte) AND
                            lineas.norma < 3
                            GROUP BY codigo
					        ORDER BY grupo, codigo ASC";
            }

            using (var db = _connectionManager.GetConnection())
            {
                var cuentas = await db.QueryAsync<CuentasBalance8ColumnasQuery>(query, new {Empresa = empresa, Periodo = periodo, FechaCorte = fechaCorte });
                List<Balance8Columnas> balance8Columnas = new List<Balance8Columnas>();

                foreach(CuentasBalance8ColumnasQuery cuenta in cuentas)
                {
                    Balance8Columnas nuevoItem = new Balance8Columnas();

                    nuevoItem.Cuenta = cuenta.Codigo;
                    nuevoItem.Codigocp = cuenta.Codigocp;
                    nuevoItem.Nombre = cuenta.Nombre;
                    nuevoItem.Debitos = cuenta.Debitos;
                    nuevoItem.Creditos = cuenta.Creditos;

                    if(cuenta.Debitos > cuenta.Creditos)
                    {
                        nuevoItem.Deudor = cuenta.Debitos - cuenta.Creditos;
                    }else
                    {
                        nuevoItem.Acreedor = cuenta.Creditos - cuenta.Debitos;
                    }

                    if(cuenta.Grupo < 3000)
                    {
                        if(cuenta.Debitos > cuenta.Creditos)
                        {
                            nuevoItem.Activos= cuenta.Debitos - cuenta.Creditos;
                        }
                        else
                        {
                            nuevoItem.Pasivos = cuenta.Creditos - cuenta.Debitos;
                        }
                    }
                    else
                    {
                        if (cuenta.Debitos > cuenta.Creditos)
                        {
                            nuevoItem.Perdida = cuenta.Debitos - cuenta.Creditos;
                        }
                        else
                        {
                            nuevoItem.Ganancia = cuenta.Creditos - cuenta.Debitos;
                        }
                    }

                    balance8Columnas.Add(nuevoItem);
                }

                return balance8Columnas;
            }

        }

        public async Task<IEnumerable<Balance8ColumnasClasificado>> BalanceClasificadoData(int empresa, int periodo, DateTime fechaCorte, bool Acumulado, bool IFRS)
        {
            string query;
            if (Acumulado)
            {
                query = @"SELECT c.codigo AS codigo,
                           c.nombre AS nombre,
                           c.grupo AS grupo,
                           g.nombre AS nombreGrupo,
                           l.codigocp,
                           SUM(l.debe) AS debitos,
                           SUM(l.haber) AS creditos
                            FROM cuentas AS c
                            JOIN lineas AS l ON c.codigo = l.cuenta
                            LEFT JOIN grupos AS g ON c.grupo = g.codigo
                            WHERE l.periodo = @Periodo
                              AND l.empresa = @Empresa
                              AND l.fecha <= @FechaCorte
                              AND l.norma < 3
                            GROUP BY codigo, nombre, grupo, nombreGrupo, codigocp
                            ORDER BY grupo, codigo ASC";

            }
            else{
                query = @"SELECT c.codigo AS codigo,
                           c.nombre AS nombre,
                           c.grupo AS grupo,
                           g.nombre AS nombreGrupo,
                           l.codigocp,
                           SUM(l.debe) AS debitos,
                           SUM(l.haber) AS creditos
                            FROM cuentas AS c
                            JOIN lineas AS l ON c.codigo = l.cuenta
                            LEFT JOIN grupos AS g ON c.grupo = g.codigo
                            WHERE l.periodo = @Periodo
                              AND l.empresa = @Empresa
                              AND l.fecha <= @FechaCorte
                              AND MONTH(l.fecha) = MONTH(@FechaCorte)
                              AND l.norma < 3
                            GROUP BY codigo, nombre, grupo, nombreGrupo, codigocp
                            ORDER BY grupo, codigo ASC";
            }
            

            using (var db = _connectionManager.GetConnection())
            {
                var cuentas = await db.QueryAsync<CuentasBalance8ColumnasQuery>(query, new { Periodo = periodo, Empresa = empresa, FechaCorte = fechaCorte});
                List<Balance8Columnas> balance8Columnas = new List<Balance8Columnas>();

                foreach (CuentasBalance8ColumnasQuery cuenta in cuentas)
                {
                    Balance8Columnas nuevoItem = new Balance8Columnas();

                    nuevoItem.Cuenta = cuenta.Codigo;
                    nuevoItem.Codigocp = cuenta.Codigocp;
                    nuevoItem.Nombre = cuenta.Nombre;
                    nuevoItem.Grupo = cuenta.Grupo;
                    nuevoItem.NombreGrupo = cuenta.NombreGrupo;
                    nuevoItem.Debitos = cuenta.Debitos;
                    nuevoItem.Creditos = cuenta.Creditos;
                    

                    if (cuenta.Debitos > cuenta.Creditos)
                    {
                        nuevoItem.Deudor = cuenta.Debitos - cuenta.Creditos;
                    }
                    else
                    {
                        nuevoItem.Acreedor = cuenta.Creditos - cuenta.Debitos;
                    }

                    if (cuenta.Grupo < 3000)
                    {
                        if (cuenta.Debitos > cuenta.Creditos)
                        {
                            nuevoItem.Activos = cuenta.Debitos - cuenta.Creditos;
                        }
                        else
                        {
                            nuevoItem.Pasivos = cuenta.Creditos - cuenta.Debitos;
                        }
                    }
                    else
                    {
                        if (cuenta.Debitos > cuenta.Creditos)
                        {
                            nuevoItem.Perdida = cuenta.Debitos - cuenta.Creditos;
                        }
                        else
                        {
                            nuevoItem.Ganancia = cuenta.Creditos - cuenta.Debitos;
                        }
                    }

                    balance8Columnas.Add(nuevoItem);
                }

                var gruposBalance8Columnas = balance8Columnas
                                            .GroupBy(item => new { item.Grupo, item.NombreGrupo })
                                            .Select(group => new Balance8ColumnasClasificado
                                            {
                                                Grupo = group.Key.Grupo,
                                                NombreGrupo = group.Key.NombreGrupo,
                                                cuentas = group.ToList()
                                            })
                                            .ToList();

                return gruposBalance8Columnas;
            }

        }

    }
}
