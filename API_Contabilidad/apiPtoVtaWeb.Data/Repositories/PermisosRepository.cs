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
    public class PermisosRepository : IPermisosRepository
    {

        private readonly InventoryDbContext _connectionManager;
        public PermisosRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<IEnumerable<Permiso>> GetAllPermisos()
        {
            using(var db = _connectionManager.GetConnection()){
                var sql = @"SELECT menu, opcion, acceso1, acceso2, acceso3, acceso4, acceso5 FROM permisos";
                return await db.QueryAsync<Permiso>(sql, new { });
            }
        }

        public async Task<bool> UpdatePermiso(Permiso permiso)
        {
            using(var db = _connectionManager.GetConnection()){
                var sql = @"UPDATE permisos SET acceso1 = @Acceso1, acceso2 =@Acceso2, acceso3=@Acceso3, acceso4=@Acceso4, acceso5=@Acceso5 
                           WHERE menu =@Menu AND opcion = @Opcion;";

                var result = await db.ExecuteAsync(sql,
                            new
                            {
                                Menu = permiso.Menu,
                                Opcion = permiso.Opcion,
                                Acceso1 = permiso.Acceso1,
                                Acceso2 = permiso.Acceso2,
                                Acceso3 = permiso.Acceso3,
                                Acceso4 = permiso.Acceso4,
                                Acceso5 = permiso.Acceso5
                            });
                return result > 0;
            }
        }
    }
}
