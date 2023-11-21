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
    public class GlosaRepository : IGlosaRepository
    {
        private readonly InventoryDbContext _connectionManager;
        public GlosaRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<bool> DeleteGlosa(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM glosas WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Referencia = referencia });
                return result > 0;
            }
        }

        public async Task<IEnumerable<Glosa>> GetAllGlosas()
        {
            using (var db = _connectionManager.GetConnection())
            {

                var sql = @"SELECT referencia, nombre FROM glosas";
                return await db.QueryAsync<Glosa>(sql, new { });
            }
        }

        public async Task<Glosa> GetGlosa(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT referencia, nombre FROM glosas WHERE referencia = @Referencia";

                return await db.QueryFirstOrDefaultAsync<Glosa>(sql, new { Referencia = referencia });
            }
        }

        public async Task<bool> InsertGlosa(Glosa newGlosa)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO glosas(nombre) VALUES(@Nombre)";

                var result = await db.ExecuteAsync(sql, new { Nombre = newGlosa.Nombre });
                return result > 0;
            }
        }

        public async Task<bool> UpdateGlosa(Glosa glosa)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"UPDATE glosas SET nombre = @Nombre WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Nombre = glosa.Nombre, Referencia = glosa.Referencia });
                return result > 0;
            }
        }
    }
}
