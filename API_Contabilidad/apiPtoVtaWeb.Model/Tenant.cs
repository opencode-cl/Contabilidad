using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model
{
    public class Tenant
    {
        public string Name { get; set; }
        public string Secret { get; set; }
        public string? ConnectionString { get; set; }

    }
}
