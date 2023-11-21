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
    public class CodigosCPRepository : ICodigosCPRepository
    {
        private readonly InventoryDbContext _connectionManager;
        public CodigosCPRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<bool> DeleteCodigo(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM codigoscp WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Referencia = referencia });
                return result > 0;
            }

        }

        public async Task<IEnumerable<CodigoCP>> GetAllCodigos()
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = "SELECT referencia, empresa, codigo, nombre FROM codigoscp";

                return await db.QueryAsync<CodigoCP>(sql, new { });
            }
        }

        public async Task<IEnumerable<CodigoCP>> GetAllCodigosEmpresa(int empresa)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = "SELECT referencia, empresa, codigo, nombre FROM codigoscp WHERE empresa =@Empresa";

                return await db.QueryAsync<CodigoCP>(sql, new { Empresa = empresa });
            }
        }

        public async Task<CodigoCP> GetCodigoDetails(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = "SELECT referencia, empresa, codigo, nombre FROM codigoscp WHERE referencia = @Referencia";

                return await db.QueryFirstOrDefaultAsync<CodigoCP>(sql, new { Referencia = referencia });
            }
        }

        public async Task<bool> InsertCodigo(CodigoCP codigocp)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO codigoscp(empresa, codigo, nombre) VALUES(@Empresa, @Codigo, @Nombre)";

                var result = await db.ExecuteAsync(sql, new { Empresa = codigocp.empresa, Codigo = codigocp.codigo, Nombre = codigocp.nombre });
                return result > 0;
            }
        }

        public async Task<bool> UpdateCodigo(CodigoCP codigocp)
        {
            using (var db = _connectionManager.GetConnection())
            {

                var sql = @"UPDATE codigoscp SET codigo = @Codigo, nombre=@Nombre WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Codigo = codigocp.codigo, Nombre = codigocp.nombre, Referencia = codigocp.referencia });
                return result > 0;
            }
        }
    }
}
