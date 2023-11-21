using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interfaces
{
    public interface ITipoDocumentoRepository
    {
        Task<IEnumerable<TipoDocumento>> GetAllTipoDocumento();
        Task<TipoDocumento> GetTipoDocumento(int referencia);
        Task<bool> InsertTipoDocumento(TipoDocumento tipoDocumento);
        Task<bool> UpdateTipoDocumento(TipoDocumento tipoDocumento);
        Task<bool> DeleteTipoDocumento(int referencia);

    }
}
