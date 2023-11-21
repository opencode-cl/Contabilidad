using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interface
{
    public interface IBancosRepository
    {
        Task<IEnumerable<Banco>> GetAllBancos();
        Task<Banco> GetBancoDetails(int referencia);
        Task<bool> InsertBanco(Banco banco);
        Task<bool> UpdateBanco(Banco banco);
        Task<bool> DeleteBanco(int referencia);
    }
}
