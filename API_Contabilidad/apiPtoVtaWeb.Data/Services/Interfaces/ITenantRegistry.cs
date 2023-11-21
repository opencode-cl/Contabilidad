using apiPtoVtaWeb.Model;

namespace apiPtoVtaWeb.Services.Interfaces
{
    public interface ITenantRegistry
    {
        List<Tenant> GetTenants();
    }
}
