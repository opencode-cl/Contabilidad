using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model
{
    public class LibroMayorEsquematico
    {
        public class Cuenta
        {
            public uint Codigo { get; set; }
            public string Nombre { get; set; }

            public List<Mensual> lineasMensuales { get; set;} 

        }

        public class Mensual
        {
            public int Mes { get; set; }
            public decimal Debito { get; set; }
            public decimal Credito { get; set; }
            public decimal Saldo { get; set; }

        }
    }
}
