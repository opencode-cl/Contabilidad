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
    public class ProyectosRepository: IProyectosRepository
    {
        private readonly InventoryDbContext _connectionManager;
        public ProyectosRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }
        public async Task<bool> DeleteProyecto(int codigo)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM proyectos WHERE codigo = @Codigo";

                var result = await db.ExecuteAsync(sql, new { Codigo = codigo });
                return result > 0;
            }
        }

        public async Task<IEnumerable<Proyecto>> GetAllProyectos()
        {
            using (var db = _connectionManager.GetConnection())
            {

                var sql = @"SELECT empresa, codigo, nombre, fuentefinanc, instrumento, codigobp, codigosap, rut, dv FROM proyectos";
                return await db.QueryAsync<Proyecto>(sql, new { });
            }
        }
        public async Task<IEnumerable<Proyecto>> GetAllProyectosEmpresa(int empresa)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT empresa, codigo, nombre, fuentefinanc, instrumento, codigobp, codigosap, rut, dv 
                            FROM proyectos 
                            WHERE empresa = @Empresa";
                return await db.QueryAsync<Proyecto>(sql, new { Empresa = empresa });
            }
        }

        public async Task<Proyecto> GetProyectoDetails(int codigo)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT empresa, codigo, nombre, fuentefinanc, instrumento, codigobp, codigosap, rut, dv 
                            FROM proyectos 
                            WHERE codigo = @Codigo";

                return await db.QueryFirstOrDefaultAsync<Proyecto>(sql, new { Codigo = codigo });
            }
        }
        public async Task<bool> InsertProyecto(Proyecto proyecto)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO proyectos(codigo, nombre, empresa, fuentefinanc, instrumento, codigobp, codigosap, rut, dv) 
                            VALUES(@Codigo, @Nombre, @Empresa, @Fuentefinanc, @Instrumento, @Codigobp, @Codigosap, @Rut, @Dv)";

                var result = await db.ExecuteAsync(sql, 
                    new { Codigo= proyecto.Codigo,
                          Nombre = proyecto.Nombre, 
                          Empresa = proyecto.Empresa,
                          Fuentefinanc = proyecto.Fuentefinanc,
                          Instrumento = proyecto.Instrumento,
                          Codigobp = proyecto.Codigobp,
                          Codigosap = proyecto.Codigosap,
                          Rut = proyecto.Rut,
                          Dv = proyecto.Dv });
                return result > 0;
            }
        }   

        public async Task<bool> UpdateProyecto(Proyecto proyecto)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"UPDATE proyectos 
                            SET nombre = @Nombre, 
                            fuentefinanc = @FuenteFinanc, instrumento = @Instrumento, 
                            codigobp = @Codigobp, 
                            codigosap = @Codigosap, 
                            rut = @Rut, dv = @Dv 
                            WHERE codigo = @Codigo";
                            
                var result = await db.ExecuteAsync(sql,
                    new { Codigo= proyecto.Codigo,
                          Nombre = proyecto.Nombre, 
                          Empresa = proyecto.Empresa,
                          Fuentefinanc = proyecto.Fuentefinanc,
                          Instrumento = proyecto.Instrumento,
                          Codigobp = proyecto.Codigobp,
                          Codigosap = proyecto.Codigosap,
                          Rut = proyecto.Rut,
                          Dv = proyecto.Dv });

                return result > 0;
            }
        }

    }
}
