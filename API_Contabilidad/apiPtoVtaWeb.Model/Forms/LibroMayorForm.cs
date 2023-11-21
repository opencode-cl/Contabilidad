using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model.Forms
{
    public class LibroMayorForm
    {

        public int Empresa { get; set; }
        public int Periodo { get; set; }
        public int CuentaInicio { get; set; }
        public int CuentaFinal { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFinal { get; set; }
        public bool IFRS { get; set; }
    }
}
