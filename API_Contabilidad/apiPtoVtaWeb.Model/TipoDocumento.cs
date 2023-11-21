using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model
{
    public class TipoDocumento
    {
        public int Referencia { get; set; }
        public int Codigo { get; set; }
        public string? Nombre { get; set; }
        public int Cuenta { get; set; }
        public char Libro { get; set; }
        public string? Exenta { get; set; }
        public string? Sigla { get; set; }
        public float Retencion { get; set; }
        public float Bonificacion { get; set; }
        public int Electronico { get; set; }
        public int Relacion { get; set; }   
    }
}
