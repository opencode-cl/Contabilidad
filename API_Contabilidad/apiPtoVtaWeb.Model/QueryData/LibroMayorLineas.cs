using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model.QueryData
{
    public class LibroMayorLineas
    {
        public int Codigo { get; set; }
        public string Tipo { get; set; }
        public int Folio { get; set; }
        public DateTime Fecha { get; set; }
        public string Glosa { get; set; }
        public int Rut { get; set; }
        public string Nombre { get; set; }
        public long Nodoc { get; set; }
        public DateTime Fedoc { get; set; }
        public int Debe { get; set; }
        public int Haber { get; set; }
        public DateTime Feven { get; set; }
        public int Obra { get; set; }
        public string Nroref { get; set; }

    }
}
