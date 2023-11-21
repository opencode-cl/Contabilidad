using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model
{
    public class Balance8Columnas
    {
        public int Cuenta { get; set; }
        public int Codigocp { get; set; }

        public int Grupo { get; set; }
        public string Nombre { get; set; }
        public string? NombreGrupo { get; set; }
        public long Debitos { get; set; }
        public long Creditos { get; set; }
        public long Deudor { get; set; }
        public long Acreedor { get; set; }
        public long Activos { get; set; }
        public long Pasivos { get; set; }
        public long Perdida { get; set; }
        public long Ganancia { get; set; }

    }

    public class Balance8ColumnasClasificado
    {
        public int Grupo { get; set; }
        public string NombreGrupo { get; set; }
        public List<Balance8Columnas> cuentas { get; set; }
    }
}
