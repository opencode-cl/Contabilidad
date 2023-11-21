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
    public class IFRSRepository : IIFRSRepository
    {

        private readonly InventoryDbContext _connectionManager;
        public IFRSRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<IEnumerable<IFRS>> GetAllIFRS()
        {
            using (var db = _connectionManager.GetConnection())
            {

                var sql = @"SELECT referencia, codigo, nombre FROM ifrs";
                return await db.QueryAsync<IFRS>(sql, new { });
            }
        }

        public async Task<IFRS> GetIFRS(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT referencia, codigo, nombre FROM ifrs WHERE referencia = @Referencia";

                return await db.QueryFirstOrDefaultAsync<IFRS>(sql, new { Referencia = referencia });
            }
        }

        public async Task<bool> UpdateIFRS(IFRS newIFRS)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"UPDATE ifrs SET nombre = @Nombre, codigo = @Codigo WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Nombre = newIFRS.nombre, Codigo = newIFRS.codigo, Referencia = newIFRS.referencia });
                return result > 0;
            }
        }
        public async Task<bool> DeleteIFRS(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM ifrs WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Referencia = referencia });
                return result > 0;
            }
        }

        public async Task<bool> InsertIFRS(IFRS newIFRS)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO ifrs(codigo, nombre) VALUES(@Codigo, @Nombre)";

                var result = await db.ExecuteAsync(sql, new { Codigo = newIFRS.codigo, Nombre = newIFRS.nombre, });
                return result > 0;
            }
        }
    }
}
