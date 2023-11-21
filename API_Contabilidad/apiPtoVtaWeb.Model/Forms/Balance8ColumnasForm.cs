using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model.Forms
{
    public class Balance8ColumnasForm
    {
        public int Periodo { get; set; }
        public int Empresa { get; set; }
        public DateTime FechaCorte { get; set; }
        public bool Acumulado { get; set; }
        public bool IFRS { get; set; }
    }
}
