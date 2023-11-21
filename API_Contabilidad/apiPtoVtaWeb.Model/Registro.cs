using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace apiPtoVtaWeb.Model
{
    public class Registro
    {

        public string? Equipo { get; set; }
        public DateTime Fecha { get; set; }
        public string Usuario { get; set; }
        public int Empresa { get; set; }
        public int Sucursal { get; set; }
        public int Periodo { get; set; }
        public int  Mes { get; set; }
        public string? Menu { get; set; }
        public string? Opcion { get; set; }

    }
}

