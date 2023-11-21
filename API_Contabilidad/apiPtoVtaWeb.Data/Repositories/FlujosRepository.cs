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
    public class FlujosRepository : IFlujosRepository
    {
        private readonly InventoryDbContext  _connectionManager;
        public FlujosRepository(InventoryDbContext  connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<bool> DeleteFlujo(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM flujos WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Referencia = referencia });
                return result > 0;
            }
        }

        public async Task<IEnumerable<Flujo>> GetAllFlujos()
        {
                        using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT codigo, nombre, referencia FROM flujos";

                return await db.QueryAsync<Flujo>(sql, new { });
            }
        }

        public async Task<Flujo> GetFlujo(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT codigo, nombre, referencia FROM flujos WHERE referencia = @Referencia";

                return await db.QueryFirstOrDefaultAsync<Flujo>(sql, new { Referencia = referencia });
            }
        }

        public async Task<bool> InsertFlujo(Flujo newFlujo)
        {
                        using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO flujos(codigo, nombre) 
                                        VALUES(@Codigo, @Nombre)";

                var result = await db.ExecuteAsync(sql,
                    new
                    {
                        Codigo = newFlujo.Codigo,
                        Nombre = newFlujo.Nombre
                    });
                return result > 0;
            }
        }

        public async Task<bool> UpdateFlujo(Flujo flujo)
        {
             using (var db = _connectionManager.GetConnection())
            {
                var sql = @"UPDATE flujos SET codigo = @Codigo, nombre = @Nombre 
                            WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql,
                            new
                            {
                                Referencia = flujo.Referencia,
                                Codigo = flujo.Codigo,
                                Nombre = flujo.Nombre
                            });
                return result > 0;
            }
        }
    }
}
