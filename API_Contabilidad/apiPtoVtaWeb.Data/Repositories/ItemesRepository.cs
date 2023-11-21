using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZstdSharp.Unsafe;

namespace apiPtoVtaWeb.Data.Repositories
{
    public class ItemesRepository : IItemesRepository
    {

        private readonly InventoryDbContext _connectionManager;
        public ItemesRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<bool> DeleteItem(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM itemes WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Referencia = referencia });
                return result > 0;
            }
        }

        public async Task<bool> DeleteItemesCuenta(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM itemesc WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Referencia = referencia });
                return result > 0;
            }
        }

        public async Task<bool> DeleteItemesMaestro(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM itemesmae WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Referencia = referencia });
                return result > 0;
            }
        }

        public async Task<ItemesCuentas> GetItemCuentaDetails(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = "SELECT referencia, codigo, empresa, cuenta, ncuenta FROM itemesc WHERE referencia = @Referencia";

                return await db.QueryFirstOrDefaultAsync<ItemesCuentas>(sql, new { Referencia = referencia });
            }
        }

        public async Task<Itemes> GetItemDetails(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = "SELECT referencia, codigo, empresa, nombre, codpre, codigomae FROM itemes WHERE referencia = @Referencia";

                return await db.QueryFirstOrDefaultAsync<Itemes>(sql, new { Referencia = referencia });
            }
        }

        public async Task<IEnumerable<Itemes>> GetItemes()
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = "SELECT referencia, codigo, empresa, nombre, codpre, codigomae FROM itemes";

                return await db.QueryAsync<Itemes>(sql, new { });
            }
        }

        public async Task<IEnumerable<ItemesCuentas>> GetItemesCuenta(int codigo)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = "SELECT cuenta, ncuenta, codigo, empresa, referencia FROM itemesc WHERE codigo = @Codigo";

                return await db.QueryAsync<ItemesCuentas>(sql, new { Codigo = codigo });
            }
        }

        public async Task<IEnumerable<ItemesMaestro>> GetItemesMaestroEmpresa(int empresa)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = "SELECT referencia, codigo, empresa, nombre FROM itemesmae WHERE empresa = @Empresa";

                return await db.QueryAsync<ItemesMaestro>(sql, new { Empresa = empresa });
            }
        }

        public async Task<ItemesMaestro> GetItemMaestroDetails(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = "SELECT referencia, codigo, empresa, nombre FROM itemesmae WHERE referencia = @Referencia";

                return await db.QueryFirstOrDefaultAsync<ItemesMaestro>(sql, new { Referencia = referencia });
            }
        }

        public async Task<bool> InsertItemes(Itemes item)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO itemes(codigo, empresa, nombre, codpre, codigomae) 
                            VALUES(@Codigo, @Empresa, @Nombre, @Codpre, @Codigomae)";

                var result = await db.ExecuteAsync(sql, new { Codigo = item.Codigo, Empresa = item.Empresa,
                                                              Nombre = item.Nombre, Codpre = item.Codpre,
                                                              Codigomae = item.Codigomae});
                return result > 0;
            }
        }

        public async Task<bool> InsertItemesCuenta(ItemesCuentas item)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO itemesc(cuenta, ncuenta, codigo, empresa) 
                            VALUES(@Cuenta, @Ncuenta, @Codigo, @Empresa)";

                var result = await db.ExecuteAsync(sql, new { Cuenta = item.Cuenta, Ncuenta = item.NCuenta,
                                                              Codigo = item.Codigo, Empresa = item.Empresa});
                return result > 0;
            }
        }

        public async Task<bool> InsertItemesMaestro(ItemesMaestro item)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO itemesmae(empresa, codigo, nombre) 
                            VALUES(@Empresa, @Codigo, @Nombre)";

                var result = await db.ExecuteAsync(sql, new { Empresa = item.Empresa, Codigo = item.Codigo,
                                                              Nombre = item.Nombre});
                return result > 0;
            }
        }

        public async Task<bool> UpdateItemes(Itemes item)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"UPDATE itemes 
                            SET codigo = @Codigo, nombre = @Nombre, codpre = @Codpre, codigomae = @Codigomae 
                            WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, 
                    new { Codigo = item.Codigo,
                          Nombre = item.Nombre,
                          Codpre = item.Codpre,
                          Codigomae = item.Codigomae,
                          Referencia = item.Referencia });
                return result > 0;
            }
        }   
        public async Task<bool> UpdateItemesMaestro(ItemesMaestro item)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"UPDATE itemesmae 
                            SET codigo = @Codigo, nombre = @Nombre 
                            WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, 
                    new { Codigo = item.Codigo,
                          Nombre = item.Nombre,
                          Referencia = item.Referencia });
                return result > 0;
            }
        }

        public async Task<IEnumerable<Itemes>> GetItemesEmpresa(int empresa)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT referencia, codigo, empresa, nombre, codpre, codigomae 
                            FROM itemes 
                            WHERE empresa = @Empresa";

                return await db.QueryAsync<Itemes>(sql, new { Empresa = empresa });
            }
        }
    }
}
