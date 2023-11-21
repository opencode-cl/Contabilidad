using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interface
{
    public interface IObrasRepository
    {
        Task<IEnumerable<Obra>> GetAllObras();
        Task<IEnumerable<Obra>> GetAllObrasEmpresa(int empresa);
        Task<Obra> GetObraDetails(int referencia);
        Task<bool> InsertObra(Obra obra);
        Task<bool> UpdateObra(Obra obra);
        Task<bool> DeleteObra(int referencia);
    }
}
