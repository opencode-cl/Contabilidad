using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model
{
    public class Proyecto
    {
        public int Codigo { get; set; }
        public int Empresa {get; set;}
        public string Nombre { get; set; }
        public string Fuentefinanc {get;set;}
        public string Instrumento {get;set;}
        public string Codigobp {get;set;}
        public string Codigosap{get;set;}
        public int Rut {get;set;}
        public string Dv {get;set;}

    }
}
