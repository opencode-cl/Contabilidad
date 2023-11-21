using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interface
{
    public interface IEmpresaRepository
    {
        Task<IEnumerable<Empresa>> GetAllEmpresas();
        Task<Empresa> GetEmpresaDetails(int codigo);
        Task<bool> InsertEmpresa(Empresa empresa);
        Task<bool> UpdateEmpresa(Empresa empresa);
        Task<bool> DeleteEmpresa(int codigo);

    }
}
