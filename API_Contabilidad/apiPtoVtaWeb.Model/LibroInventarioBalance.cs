using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static apiPtoVtaWeb.Model.LibroInventarioBalance;

namespace apiPtoVtaWeb.Model
{
    public class LibroInventarioBalance
    {
        public class LIBLinea
        {
            public long? Debe { get; set; }
            public long? Haber { get; set; }
            public long? Nodoc { get; set; }
        }

        public class LIBAuxiliar
        {
            public uint? AuxiliarCodigo { get; set; }
            public string? AuxiliarNombre { get; set; }
            public string? AuxiliarDV { get; set; }
            public List<LIBLinea> Lineas { get; set; }
        }

        public class LIBCuenta
        {
            public uint? CuentaCodigo { get; set; }
            public string CuentaNombre { get; set; }
            public uint CuentaGrupo { get; set; }
            public List<LIBAuxiliar> AuxiliarGroups { get; set; }
        }

    }
}
