using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model
{
    public class Nombres
    {
        public int Codigo {get; set;}

        public string Dv {get; set;}
        public string Nombre { get; set; }
        public string Direccion {get; set;}
        public string Ciudad {get; set;}
        public string Comuna {get; set;}
        public string Giro{ get; set; }
        public string Telefonos{get;set;}
        public string Fax {get; set;}
        public string Email {get; set;}
        public int Tipo {get; set;}
        public int Banco {get; set;}
        public int Tipocuenta {get; set;}
        public int Nrocuenta {get; set;}
        public string Emailintercambio {get;set;}
        public string Condiciones {get;set;}
    }
}
