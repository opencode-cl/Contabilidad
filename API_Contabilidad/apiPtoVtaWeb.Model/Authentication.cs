using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model
{
    public class Authentication
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set;}

        public string Conexion { get; set;}

        public string Nombre { get; set;}

        public string Host { get; set; }
        public string Port { get; set;} 
        public string Database { get; set; }
        public string Usuariobd { get; set; }
        public string Passwordbd { get; set; }

    }
}
