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
    public class ObrasRepository: IObrasRepository
    {
        private readonly InventoryDbContext _connectionManager;
        public ObrasRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<bool> DeleteObra(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM obras WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Referencia = referencia });
                return result > 0;
            }
        }

        public async Task<IEnumerable<Obra>> GetAllObras()
        {
            using (var db = _connectionManager.GetConnection())
            {

                var sql = @"SELECT referencia, codigo, nombre, empresa FROM obras";
                return await db.QueryAsync<Obra>(sql, new { });
            }
        }

        public async Task<IEnumerable<Obra>> GetAllObrasEmpresa(int empresa)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT referencia, codigo, nombre, empresa FROM obras WHERE empresa = @Empresa";
                return await db.QueryAsync<Obra>(sql, new { Empresa = empresa });
            }
        }

        public async Task<Obra> GetObraDetails(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT referencia, nombre, codigo, empresa FROM obras WHERE referencia = @Referencia";

                return await db.QueryFirstOrDefaultAsync<Obra>(sql, new { Referencia = referencia });
            }
        }

        public async Task<bool> InsertObra(Obra obra)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO obras(codigo, nombre, empresa) VALUES(@Codigo, @Nombre, @Empresa)";

                var result = await db.ExecuteAsync(sql, new { Codigo= obra.Codigo, Nombre = obra.Nombre, Empresa = obra.Empresa });
                return result > 0;
            }
        }

        public async Task<bool> UpdateObra(Obra obra)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"UPDATE obras SET codigo = @Codigo, nombre = @Nombre
                            WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Codigo = obra.Codigo, Nombre = obra.Nombre, Empresa = obra.Empresa, Referencia = obra.Referencia });
                return result > 0;
            }
        }
    }
}
