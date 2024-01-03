using System;
using apiPtoVtaWeb.Model;

namespace API_Contabilidad.Model
{
    public class LineaConDetalles : Linea
    {
        public Cuenta cuenta_Object { get; set; }
        public string cuenta_nombre { get; set; }
        public string auxiliar_nombre { get; set; }
        public string obra_nombre { get; set; }
        public string flujo_nombre { get; set; }
        public string item_nombre { get; set; }
    }
}

