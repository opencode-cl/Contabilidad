using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories
{
    public class CuentasRepository : ICuentasRepository
    {
        private readonly InventoryDbContext _connectionManager;
        public CuentasRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<bool> DeleteCuenta(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM cuentas WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Referencia = referencia });
                return result > 0;
            }

        }

        public async Task<IEnumerable<Cuenta>> GetAllCuentas()
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT referencia, codigo, nombre, grupo, ngrupo, centro, item, rut, nroref, codfin, 
                        efectivo, flujo, ifrs, ppto, pptc FROM cuentas";

                return await db.QueryAsync<Cuenta>(sql, new { });
            }
        }

        public async Task<Cuenta> GetCuentaDetails(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT referencia, codigo, nombre, grupo, ngrupo, centro, item, rut, nroref, codfin,
                        efectivo, flujo, ifrs, ppto, pptc FROM cuentas WHERE referencia = @Referencia";

                return await db.QueryFirstOrDefaultAsync<Cuenta>(sql, new { Referencia = referencia });
            }
        }

        public async Task<bool> InsertCuenta(Cuenta cuenta)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO cuentas(codigo, nombre, grupo, ngrupo, centro, item, rut, nroref, codfin,
                                        efectivo, flujo, ifrs, ppto, pptc) 
                                        VALUES(@Codigo, @Nombre, @Grupo, @Ngrupo, @Centro, @Item, @Rut, @Nroref, @Codfin,
                                        @Efectivo, @Flujo, @Ifrs, @Ppto, @Pptc)";

                var result = await db.ExecuteAsync(sql,
                    new
                    {
                        Codigo = cuenta.Codigo,
                        Nombre = cuenta.Nombre,
                        Grupo = cuenta.Grupo,
                        NGrupo = cuenta.NGrupo,
                        Centro = cuenta.Centro,
                        Item = cuenta.Item,
                        Rut = cuenta.Rut,
                        Nroref = cuenta.NroRef,
                        CodFin = cuenta.Codfin,
                        Efectivo = cuenta.Efectivo,
                        Flujo = cuenta.Flujo,
                        Ifrs = cuenta.IFRS,
                        Ppto = cuenta.Ppto,
                        Pptc = cuenta.Pptc
                    });
                return result > 0;
            }
        }

        public async Task<bool> UpdateCuenta(Cuenta cuenta)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"UPDATE cuentas SET codigo = @Codigo, nombre = @Nombre, grupo =@Grupo, ngrupo = @Ngrupo, centro = @Centro, item = @Item, 
                        rut = @Rut, nroref = @Nroref, codfin = @Codfin,
                        efectivo = @Efectivo, flujo = @Flujo, ifrs = @Ifrs, ppto=@Ppto, pptc=@Pptc
                        WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql,
                            new
                            {
                                Referencia = cuenta.Referencia,
                                Codigo = cuenta.Codigo,
                                Nombre = cuenta.Nombre,
                                Grupo = cuenta.Grupo,
                                NGrupo = cuenta.NGrupo,
                                Centro = cuenta.Centro,
                                Item = cuenta.Item,
                                Rut = cuenta.Rut,
                                Nroref = cuenta.NroRef,
                                CodFin = cuenta.Codfin,
                                Efectivo = cuenta.Efectivo,
                                Flujo = cuenta.Flujo,
                                Ifrs = cuenta.IFRS,
                                Ppto = cuenta.Ppto,
                                Pptc = cuenta.Pptc
                            });
                return result > 0;
            }
        }

        public async Task<IEnumerable<Cuenta.CuentaResumen>> GetAllCuentasResumen()
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT referencia, codigo, nombre FROM cuentas";

                return await db.QueryAsync<Cuenta.CuentaResumen>(sql, new { });
            }
        }
    }
}
