using apiPtoVtaWeb.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interfaces
{
    public interface ILineasRepository
    {
        Task<IEnumerable<Linea>> GetAllLineas();
        Task<Linea> GetLineaDetails(int referencia);
        Task<IEnumerable<Linea>> GetLineasFolio(int numerofolio);
        Task<bool> InsertLinea(Linea linea);
        Task<bool> UpdateLinea(Linea linea);
        Task<bool> DeleteLinea(int referencia);
    }
}