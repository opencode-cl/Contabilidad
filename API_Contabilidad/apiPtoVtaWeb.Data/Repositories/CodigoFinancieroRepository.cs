using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Dapper;
using MySqlX.XDevAPI.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories
{
    public class CodigoFinancieroRepository : ICodigoFinancieroRepository
    {

        private readonly InventoryDbContext _connectionManager;

        public CodigoFinancieroRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<bool> DeleteCodigoFinanciero(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM codfin WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Referencia = referencia });
                return result > 0;
            }
        }

        public async Task<bool> EditCodigoFinanciero(CodigoFinanciero codigo)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"UPDATE codfin SET codigo = @Codigo, nombre = @Nombre WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Codigo = codigo.Codigo, Nombre = codigo.Nombre, Referencia = codigo.Referencia });
                return result > 0;
            }
        }

        public async Task<IEnumerable<CodigoFinanciero>> GetAllCodigosFinancieros()
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT referencia, codigo, nombre FROM codfin";

                return await db.QueryAsync<CodigoFinanciero>(sql, new { });
            }
        }

        public async Task<CodigoFinanciero> GetCodigoFinancieroById(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT referencia, codigo, nombre FROM codfin WHERE referencia = @Referencia";

                return await db.QueryFirstOrDefaultAsync<CodigoFinanciero>(sql, new { Referencia = referencia });
            }
        }

        public async Task<bool> InsertCodigoFinanciero(CodigoFinanciero codigo)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO codfin(codigo, nombre) VALUES(@Codigo,@Nombre)";

                var result = await db.ExecuteAsync(sql, new { Codigo = codigo.Codigo, Nombre = codigo.Nombre });
                return result > 0;
            }
        }
    }
}
