using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model
{
    public class UserTenant
    {
            public string Name { get; set; } = null!;
            public string Secret { get; set; } = null!;
            public string TenantId { get; set; } = null!;
        
    }
}
