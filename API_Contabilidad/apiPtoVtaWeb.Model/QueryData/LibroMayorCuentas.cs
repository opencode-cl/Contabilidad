using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model.QueryData
{
    public class LibroMayorCuentas
    {
        public int Codigo { get; set; }
        public string Nombre { get; set; }
        public long Debitos  { get; set; }
        public long Creditos{ get; set; }

    }
}
