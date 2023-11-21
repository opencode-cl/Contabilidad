using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interface
{
    public interface ISucursalesRepository
    {
        Task<IEnumerable<Sucursal>> GetAllSucursales();
        Task<IEnumerable<Sucursal>> GetAllSucursalesEmpresa(int empresa);
        Task<Sucursal> GetSucursalDetails(int referencia);
        Task<bool> InsertSucursal(Sucursal sucursal);
        Task<bool> UpdateSucursal(Sucursal sucursal);
        Task<bool> DeleteSucursal(int referencia);
    }
}
