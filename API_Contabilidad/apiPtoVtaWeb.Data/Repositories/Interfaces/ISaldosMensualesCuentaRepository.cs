using apiPtoVtaWeb.Model;
using apiPtoVtaWeb.Model.QueryData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interfaces
{
    public interface ISaldosMensualesCuentaRepository
    {
        public Task<IEnumerable<SaldoMensualesCuenta>> SaldosMensualesCuentaData(int empresa, int periodo, int mes, int cuentaInicio, int cuentaFinal);

    }
}
