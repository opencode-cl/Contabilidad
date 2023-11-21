using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Dapper;

namespace apiPtoVtaWeb.Data.Repositories
{
    public class CentroRepository : ICentroRepository
    {
        private readonly InventoryDbContext _connectionManager;

        public CentroRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<IEnumerable<Centro>> GetAllCentros()
        {
            using (var db = _connectionManager.GetConnection())
            {

                var sql = @"SELECT empresa,codigo, nombre,codsuc, referencia, fsegacc FROM centros";
                return await db.QueryAsync<Centro>(sql, new { });
            }
        }

        public async Task<Centro> GetCentro(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT empresa,codigo, nombre,codsuc, referencia, fsegacc FROM centros WHERE referencia = @Referencia";

                return await db.QueryFirstOrDefaultAsync<Centro>(sql, new { Referencia = referencia });
            }
        }
    }
}

