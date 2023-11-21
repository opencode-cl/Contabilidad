using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using apiPtoVtaWeb.Model;

namespace apiPtoVtaWeb.Data.Repositories.Interfaces
{
    public interface IIFRSRepository
    {
        Task<IEnumerable<IFRS>> GetAllIFRS();
        Task<IFRS> GetIFRS(int referencia);
        Task<bool> InsertIFRS(IFRS newIFRS);
        Task<bool> UpdateIFRS(IFRS newIFRS);
        Task<bool> DeleteIFRS(int referencia);

    }
}
