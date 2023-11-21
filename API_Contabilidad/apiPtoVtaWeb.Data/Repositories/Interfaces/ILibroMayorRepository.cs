using apiPtoVtaWeb.Model.QueryData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interfaces
{
    public interface ILibroMayorRepository
    {
        public Task<byte[]> LibroMayor(int empresa, int periodo, int cuentaInicio, int cuentaFinal, DateTime fechaInicio, DateTime fechaFinal, bool IFRS);
        public Task<IEnumerable<LibroMayor>> LibroMayorData(int empresa, int periodo, int cuentaInicio, int cuentaFinal, DateTime fechaInicio, DateTime fechaFinal, bool IFRS);
    }
}
