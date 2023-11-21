using apiPtoVtaWeb.Data.Repositories.Interface;
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
    public class SucursalesRepository: ISucursalesRepository
    {
        private readonly InventoryDbContext _connectionManager;
        public SucursalesRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<bool> DeleteSucursal(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM sucursales WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Referencia = referencia });
                return result > 0;
            }
        }

        public async Task<IEnumerable<Sucursal>> GetAllSucursales()
        {
            using (var db = _connectionManager.GetConnection())
            {

                var sql = @"SELECT referencia, codigo, nombre, empresa, direccion, factura, tipo FROM sucursales";
                return await db.QueryAsync<Sucursal>(sql, new { });
            }
        }

        public async Task<IEnumerable<Sucursal>> GetAllSucursalesEmpresa(int empresa)
        {
            using (var db = _connectionManager.GetConnection())
            {

                var sql = @"SELECT referencia, codigo, nombre, empresa, direccion, factura, tipo FROM sucursales WHERE empresa = @Empresa";
                return await db.QueryAsync<Sucursal>(sql, new { Empresa = empresa });
            }
        }

        public async Task<Sucursal> GetSucursalDetails(int referencia)
        {
             using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT referencia, codigo, nombre, empresa, direccion, factura, tipo FROM sucursales WHERE referencia = @Referencia";

                return await db.QueryFirstOrDefaultAsync<Sucursal>(sql, new { Referencia = referencia });
            }
        }

        public async Task<bool> InsertSucursal(Sucursal sucursal)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO sucursales(codigo, nombre, empresa, direccion, factura, tipo) 
                            VALUES(@Codigo, @Nombre, @Empresa, @Direccion, @Factura, @Tipo)";

                var result = await db.ExecuteAsync(sql, new { 
                    Codigo= sucursal.Codigo, 
                    Nombre = sucursal.Nombre, 
                    Empresa = sucursal.Empresa,
                    Direccion = sucursal.Direccion,
                    Factura = sucursal.Factura,
                    Tipo = sucursal.Tipo
                 });
                return result > 0;
            }
        }

        public async Task<bool> UpdateSucursal(Sucursal sucursal)
        {
             using (var db = _connectionManager.GetConnection())
            {
                var sql = @"UPDATE Sucursales SET codigo = @Codigo, nombre = @Nombre, direccion = @Direccion,
                            factura = @Factura, tipo = @Tipo 
                            WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, 
                new { Codigo = sucursal.Codigo,
                     Nombre = sucursal.Nombre,
                     Direccion = sucursal.Direccion,
                     Factura = sucursal.Factura,
                     Tipo = sucursal.Tipo,
                     Referencia = sucursal.Referencia 
                });

                return result > 0;
            }
        }
    }
}
