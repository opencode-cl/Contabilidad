using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model.QueryData
{
    public class SaldosMensualesLineas
    {
        public int Grupo { get; set; }
        public string NGrupo { get; set; }

        public int Codigo { get; set; }
        public string Nombre { get; set; }
        public DateTime Fecha { get; set; }
        public long Debe { get; set; }
        public long Haber { get; set; }
    }
}
