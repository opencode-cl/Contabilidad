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
    public class GrupoRepository : IGruposRepository
    {

        private readonly InventoryDbContext _connectionManager;
        public GrupoRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }
        public async Task<bool> DeleteGrupo(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM grupos WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Referencia = referencia });
                return result > 0;
            }
        }

        public async Task<IEnumerable<Grupo>> GetAllGrupos()
        {
            using (var db = _connectionManager.GetConnection())
            {

                var sql = @"SELECT referencia, codigo, nombre FROM grupos";
                return await db.QueryAsync<Grupo>(sql, new { });
            }
        }

        public async Task<Grupo> GetGrupo(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT referencia, codigo, nombre FROM grupos WHERE referencia = @Referencia";

                return await db.QueryFirstOrDefaultAsync<Grupo>(sql, new { Referencia = referencia });
            }
        }

        public async Task<bool> InsertGrupo(Grupo newGrupo)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO grupos(codigo, nombre) VALUES(@Codigo, @Nombre)";

                var result = await db.ExecuteAsync(sql, new { Codigo = newGrupo.Codigo, Nombre = newGrupo.Nombre });
                return result > 0;
            }
        }

        public async Task<bool> UpdateGrupo(Grupo grupo)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"UPDATE grupos SET codigo = @Codigo, nombre = @Nombre WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Codigo = grupo.Codigo, Nombre = grupo.Nombre, Referencia = grupo.Referencia });
                return result > 0;
            }
        }
    }
}
