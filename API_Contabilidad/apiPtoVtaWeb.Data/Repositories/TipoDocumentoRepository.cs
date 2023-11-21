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
    public class TipoDocumentoRepository : ITipoDocumentoRepository
    {

        private readonly InventoryDbContext _connectionManager;
        public TipoDocumentoRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }
        public async Task<bool> DeleteTipoDocumento(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM tipodocs WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Referencia = referencia });
                return result > 0;
            }
        }

        public async Task<IEnumerable<TipoDocumento>> GetAllTipoDocumento()
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT codigo, nombre, cuenta, libro, exenta, sigla, retencion, bonificacion,
                        electronico, referencia, relacion FROM tipodocs";
                return await db.QueryAsync<TipoDocumento>(sql, new { });
            }
        }

        public async Task<TipoDocumento> GetTipoDocumento(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {

                var sql = @"SELECT codigo, nombre, cuenta, libro, exenta, sigla, retencion, bonificacion,
                        electronico, referencia, relacion FROM tipodocs WHERE referencia = @Referencia";
                return await db.QueryFirstOrDefaultAsync<TipoDocumento>(sql, new { Referencia = referencia });
            }
        }

        public async Task<bool> InsertTipoDocumento(TipoDocumento tipoDocumento)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO tipodocs(codigo, nombre, cuenta, libro, exenta, sigla, retencion, bonificacion, electronico, relacion) 
                        VALUES(@Codigo, @Nombre, @Cuenta, @Libro, @Exenta, @Sigla, @Retencion, @Bonificacion, @Electronico, @Relacion)";

                var result = await db.ExecuteAsync(sql, new
                {
                    Codigo = tipoDocumento.Codigo,
                    Nombre = tipoDocumento.Nombre,
                    Cuenta = tipoDocumento.Cuenta,
                    Libro = tipoDocumento.Libro,
                    Exenta = tipoDocumento.Exenta,
                    Sigla = tipoDocumento.Sigla,
                    Retencion = tipoDocumento.Retencion,
                    Bonificacion = tipoDocumento.Bonificacion,
                    Electronico = tipoDocumento.Electronico,
                    Relacion = tipoDocumento.Relacion
                });
                return result > 0;
            }
        }

        public async Task<bool> UpdateTipoDocumento(TipoDocumento tipoDocumento)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"UPDATE tipodocs SET codigo = @Codigo, nombre = @Nombre, cuenta = @Cuenta, libro = @Libro,
                        exenta = @Exenta, sigla = @Sigla, retencion = @Retencion, bonificacion = @Bonificacion,
                        electronico = @Electronico
                        WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new
                {
                    Referencia = tipoDocumento.Referencia,
                    Codigo = tipoDocumento.Codigo,
                    Nombre = tipoDocumento.Nombre,
                    Cuenta = tipoDocumento.Cuenta,
                    Libro = tipoDocumento.Libro,
                    Exenta = tipoDocumento.Exenta,
                    Sigla = tipoDocumento.Sigla,
                    Retencion = tipoDocumento.Retencion,
                    Bonificacion = tipoDocumento.Bonificacion,
                    Electronico = tipoDocumento.Electronico,
                });
                return result > 0;
            }
        }

    }

}
