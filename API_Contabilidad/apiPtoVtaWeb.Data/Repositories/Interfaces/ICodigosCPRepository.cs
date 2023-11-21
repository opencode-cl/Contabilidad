using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interface
{
    public interface ICodigosCPRepository
    {
        Task<IEnumerable<CodigoCP>> GetAllCodigos();
        Task<IEnumerable<CodigoCP>> GetAllCodigosEmpresa(int empresa);
        Task<CodigoCP> GetCodigoDetails(int referencia);
        Task<bool> InsertCodigo(CodigoCP codigocp);
        Task<bool> UpdateCodigo(CodigoCP codigocp);
        Task<bool> DeleteCodigo(int referencia);
    }
}
