using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model
{
    public class TenantOptions
    {
        public string? DefaultConnection { get; set; }
        public List<Tenant> Tenants { get; set; } = new List<Tenant>();

        public void AddTenant(Tenant tenant)
        {
            Tenants.Add(tenant);
        }

    }
}
