using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model.Forms
{
    public class LibroMayorEsquematicoForm
    {
        public int Empresa { get; set; }
        public int Periodo { get; set; }
        public int Mes { get; set; }
        public int CuentaInicial { get; set; }
        public int CuentaFinal { get; set; }
    }
}
