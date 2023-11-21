using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace apiPtoVtaWeb.Data.Repositories.Interfaces
{
    public interface ILibroInventarioBalanceRepository
    {

        Task<IEnumerable<LibroInventarioBalance.LIBCuenta>> LibroData(int empresa, int periodo, DateTime fechaCorte, int cuentaInicial, int cuentaFinal);

    }
}
