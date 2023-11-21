using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model
{
    public class LibroDiario
    {

        public int Numerof { get; set; }
        public string Tipof { get; set; }
        public int Nodoclf { get; set; }
        public DateTime Fechaf { get; set; }
        public string Glosaf { get; set; }
        public int Valorf { get; set; }
        public string Tipo { get; set; }
        public int Numero { get; set; }
        public DateTime Fecha { get; set; }
        public int Cuenta { get; set; }
        public string Obra { get; set; }
        public string Ncuenta { get; set; }
        public string Auxiliar { get; set; }
        public string Td { get; set; }
        public BigInteger Nodoc { get; set; }
        public int Debe { get; set; }
        public int Haber { get; set; }
        public string Glosa { get; set; }
        public string Nroref { get; set; }
        public string Codant { get; set; }

        public string nombreTipoDoc { get; set; }

    }
}
