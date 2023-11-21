using apiPtoVtaWeb.Model;
using apiPtoVtaWeb.Services.Interfaces;
using Dapper;
using System.Collections.Generic;

namespace apiPtoVtaWeb.Data.Services
{
    public class TenantRegistry : ITenantRegistry
    {
        private readonly TenantOptions _tenantOptions;
        private readonly DatabaseConnectionManager _connectionManager;
        public TenantRegistry(DatabaseConnectionManager connectionManager)
        {
            _connectionManager = connectionManager;
            _tenantOptions = new TenantOptions();

            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT u.nombre, u.email, u.host, u.port, u.database, u.usuariobd, u.passwordbd FROM usuarios_contabilidad u";
                IEnumerable<Authentication> listTenants = db.Query<Authentication>(sql, new { });

                foreach (Authentication auth in listTenants)
                {
                    Tenant new_tenant = new Tenant();
                    UserTenant new_user = new UserTenant();

                    new_tenant.Name = auth.Nombre;
                    new_tenant.ConnectionString = "server=" + auth.Host +";port="+ auth.Port + ";database="+auth.Database + ";uid="+auth.Usuariobd+";password="+auth.Passwordbd + ";Convert Zero Datetime=True";

                    _tenantOptions.AddTenant(new_tenant);
                }
            }   
        }
        public List<Tenant> GetTenants() => _tenantOptions.Tenants;
    }
}