using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model
{
    public class ItemesMaestro
    {
        public int Referencia {get; set;}
        public int Codigo { get; set; }
        public int Empresa { get; set; }
        public string? Nombre { get; set; }
    }
}