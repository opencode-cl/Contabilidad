using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interfaces
{
    public interface ICodigoFinancieroRepository
    {
        Task<IEnumerable<CodigoFinanciero>> GetAllCodigosFinancieros();
        Task<CodigoFinanciero> GetCodigoFinancieroById(int referencia);
        Task<bool> EditCodigoFinanciero(CodigoFinanciero codigo);
        Task<bool> InsertCodigoFinanciero(CodigoFinanciero codigo);
        Task<bool> DeleteCodigoFinanciero(int referencia);
        
    }
}
