using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model
{
    public class Empresa
    {

        public int Codigo { get; set;}
        public int Rut { get; set; }
        public char Dv { get; set; }
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string Ciudad { get; set; }
        public string Comuna { get; set; }
        public string Giro { get; set; }
        public string Replegal { get; set; }
        public int Rutreplegal { get; set; }
        public string Dvrutreplegal { get; set; }
        public int Controlila { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Smtp { get; set; }
        public string Imap { get; set; }
        public string Emailcorp { get; set; }
        public int Puerto { get; set; }
        public int Telefono { get; set; }
        public int Rutusuariosii { get; set; }
        public string Dvusuariosii { get; set; }
        public int Codacteco { get; set; }
        public int Codsucsii { get; set; }
        public int Vbegresos { get; set; }
        public string Nomsucsii { get; set; }
        public DateTime Fechares { get; set; }
        public int Numerores { get; set; }
        public float Ppm { get; set; }
        public int Foliomensual { get; set; }

    }
}
    