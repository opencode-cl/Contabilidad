using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Contabilidad.Model
{
    public class FolioCompleto
    {

        public Folio folio { get; set; }
        public List<Linea> lineas { get; set; }

    }
}
