using apiPtoVtaWeb.Model;
using apiPtoVtaWeb.Model.QueryData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interfaces
{
    public interface IBalance8ColumnasRepository
    {

        public Task<IEnumerable<Balance8Columnas>> BalanceData(int empresa, int periodo, DateTime fechaCorte , bool Acumulado, bool IFRS);

        public Task<IEnumerable<Balance8ColumnasClasificado>> BalanceClasificadoData(int empresa, int periodo, DateTime fechaCorte, bool Acumulado, bool IFRS);

    }
}
