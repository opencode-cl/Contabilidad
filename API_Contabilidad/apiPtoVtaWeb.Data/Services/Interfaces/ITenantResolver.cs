using apiPtoVtaWeb.Model;

namespace apiPtoVtaWeb.Services.Interfaces
{
    public interface ITenantResolver
    {
        Tenant GetCurrentTenant();
    }
}
