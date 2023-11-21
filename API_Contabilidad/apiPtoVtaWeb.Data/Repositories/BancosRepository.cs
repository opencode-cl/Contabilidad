using apiPtoVtaWeb.Data.Repositories.Interface;
using apiPtoVtaWeb.Model;
using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories
{
    public class BancosRepository : IBancosRepository
    {
        private readonly InventoryDbContext _connectionManager;
        public BancosRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<bool> DeleteBanco(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM bancos WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Referencia = referencia });
                return result > 0;
            }
        }

        public async Task<IEnumerable<Banco>> GetAllBancos()
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = "SELECT referencia, codigo, nombre FROM bancos";

                return await db.QueryAsync<Banco>(sql, new { });
            }
        }

        public async Task<Banco> GetBancoDetails(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = "SELECT referencia, codigo, nombre FROM bancos WHERE referencia = @Referencia";

                return await db.QueryFirstOrDefaultAsync<Banco>(sql, new { Referencia = referencia });
            }
        }

        public async Task<bool> InsertBanco(Banco banco)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO bancos(codigo, nombre) VALUES(@Codigo, @Nombre)";

                var result = await db.ExecuteAsync(sql, new { Codigo = banco.Codigo, Nombre = banco.Nombre });
                return result > 0;
            }
        }

        public async Task<bool> UpdateBanco(Banco banco)
        {
            using (var db = _connectionManager.GetConnection())
            {

                var sql = @"UPDATE bancos SET codigo = @Codigo, nombre=@Nombre WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Codigo = banco.Codigo, Nombre = banco.Nombre, Referencia = banco.Referencia });
                return result > 0;
            }
        }
    }
}
