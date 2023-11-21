using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interface
{
    public interface IProyectosRepository
    {
        Task<IEnumerable<Proyecto>> GetAllProyectos();
        Task<IEnumerable<Proyecto>> GetAllProyectosEmpresa(int empresa);
        Task<Proyecto> GetProyectoDetails(int codigo);
        Task<bool> InsertProyecto(Proyecto proyecto);
        Task<bool> UpdateProyecto(Proyecto proyecto);
        Task<bool> DeleteProyecto(int codigo);
    }
}
