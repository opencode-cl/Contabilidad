using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interfaces
{
    public interface IGlosaRepository
    {
        Task<IEnumerable<Glosa>> GetAllGlosas();
        Task<Glosa> GetGlosa(int referencia);
        Task<bool> InsertGlosa(Glosa newGlosa);
        Task<bool> UpdateGlosa(Glosa newGlosa);
        Task<bool> DeleteGlosa(int referencia);
    }
}
