using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interfaces
{
    public interface ILibroDiarioRepository
    {

        Task<byte[]> LibroDiario(int empresa, int periodo, DateTime fechaInicio, DateTime fechaFinal, bool resumido);
        Task<IEnumerable<LibroDiario>> LibroDiarioData(int empresa, int periodo, DateTime fechaInicio, DateTime fechaFinal);
    }
}
