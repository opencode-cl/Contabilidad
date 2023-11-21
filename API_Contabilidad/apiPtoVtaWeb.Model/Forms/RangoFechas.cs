using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model.Forms
{
    public class RangoFechasForm
    {
        public DateTime Fechai { get; set; }
        public DateTime Fechaf { get; set; }
        public int Periodo { get; set; }
        public int Empresa { get; set; }
    }
}
