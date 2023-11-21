using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model
{
    public class Cuenta
    {
        public int Referencia { get; set; }
        public int Codigo { get; set; }

        [Column("nombre")]
        public string Nombre { get; set;}
        public int Grupo { get; set;}
        public string NGrupo { get; set;}
        public string Centro { get; set; }

        public string? Obra { get; set;}
        public string Item { get; set;}
        public string? Partida { get; set;}
        public string Rut { get; set; }
        public int Codfin { get; set; }
        public string Efectivo { get; set; }
        public int Flujo { get; set; }
        public string? Tipo { get; set; }
        public int IFRS { get; set; }
        public string? Rut2 { get; set; }
        public string? CodFontana { get; set; }
        public string? Clase { get; set; }
        public int Indapertura { get; set; }
        public int Ppto { get; set; }
        public int Pptc { get; set; }
        public string? Codigocp { get; set; }
        public string NroRef { get; set; }

        public class CuentaResumen
        {
            public int Referencia { get; set; }
            public int Codigo { get; set;}
            public string Nombre { get; set; }
        }
    }
}
