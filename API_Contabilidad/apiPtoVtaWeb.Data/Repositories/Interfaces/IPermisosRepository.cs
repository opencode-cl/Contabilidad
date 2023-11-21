using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interfaces
{
    public interface IPermisosRepository
    {
        Task<IEnumerable<Permiso>> GetAllPermisos();
        Task<bool> UpdatePermiso(Permiso permiso);
    }
}
