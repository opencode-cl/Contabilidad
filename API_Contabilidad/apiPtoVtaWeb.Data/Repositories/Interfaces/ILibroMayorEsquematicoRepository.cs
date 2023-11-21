using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interfaces
{
    public interface ILibroMayorEsquematicoRepository
    {

        public Task<IEnumerable<LibroMayorEsquematico.Cuenta>> LibroMayorEsquematicoData(int empresa, int periodo, int mes, int cuentaInicial, int cuentaFinal);

    }
}
