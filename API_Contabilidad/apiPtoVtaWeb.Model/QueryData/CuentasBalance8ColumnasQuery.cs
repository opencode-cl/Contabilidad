using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model.QueryData
{
    public class CuentasBalance8ColumnasQuery
    {
        public int Codigo {  get; set; }
        public string Nombre { get; set; }
        public int Grupo {  get; set; }

        public int Codigocp { get; set; }
        public long Debitos { get; set; }
        public long Creditos { get; set; }

        public string NombreGrupo { get; set; }
    }
}
