using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interfaces
{
    public interface ICuentasRepository
    {
        Task<IEnumerable<Cuenta>> GetAllCuentas();
        Task<Cuenta> GetCuentaDetails(int referencia);
        Task<bool> InsertCuenta(Cuenta cuenta);
        Task<bool> UpdateCuenta(Cuenta cuenta);
        Task<bool> DeleteCuenta(int referencia);
        Task<IEnumerable<Cuenta.CuentaResumen>> GetAllCuentasResumen();
    }
}
