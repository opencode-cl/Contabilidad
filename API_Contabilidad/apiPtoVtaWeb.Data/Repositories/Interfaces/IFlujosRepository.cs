using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interfaces
{
    public interface IFlujosRepository
    {
        Task<IEnumerable<Flujo>> GetAllFlujos();
        Task<Flujo> GetFlujo(int referencia);
        Task<bool> InsertFlujo(Flujo newFlujo);
        Task<bool> UpdateFlujo(Flujo flujo);
        Task<bool> DeleteFlujo(int referencia);
    }
}
