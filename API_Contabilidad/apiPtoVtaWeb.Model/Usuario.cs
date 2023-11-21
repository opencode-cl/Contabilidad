using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model
{
    public class Usuario
    {

        public int Referencia {get; set;}
        public String Codigo { get; set; }
        public String Clave { get; set; }

        public String Nombre {get; set;}
        public int Opciones {get; set;}

    }
}
