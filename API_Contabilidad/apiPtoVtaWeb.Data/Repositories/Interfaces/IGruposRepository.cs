using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interfaces
{
    public interface IGruposRepository
    {
        Task<IEnumerable<Grupo>> GetAllGrupos();
        Task<Grupo> GetGrupo(int referencia);
        Task<bool> InsertGrupo(Grupo newGrupo);
        Task<bool> UpdateGrupo(Grupo grupo);
        Task<bool> DeleteGrupo(int referencia);
    }
}
