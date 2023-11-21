using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interfaces
{
    public interface INombresRepository
    {
        Task<IEnumerable<Nombres>> GetAllNombres();
        Task<Nombres> GetNombre(int codigo);
        Task<bool> InsertNombres(Nombres newNombres);
        Task<bool> UpdateNombres(Nombres newNombres);
        Task<bool> DeleteNombres(int referencia);
    }
}
