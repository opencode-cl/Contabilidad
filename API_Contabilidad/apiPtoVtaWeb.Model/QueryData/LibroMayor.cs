using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model.QueryData
{
    public class LibroMayor
    {
        public LibroMayorCuentas Cuenta { get; set; }
        public IEnumerable<LibroMayorLineas> Lineas { get; set; }
    }
}
