using apiPtoVtaWeb.Model;
using apiPtoVtaWeb.Services.Interfaces;
using MySql.Data.MySqlClient;
using System.Collections.Generic;
using System.Reflection.Emit;

public class InventoryDbContext
{
    private readonly Tenant _tenant;
    private MySqlConnection _connection;
    public InventoryDbContext(ITenantResolver tenantResolver)
    {
        _tenant = tenantResolver.GetCurrentTenant();
        if (_tenant.ConnectionString is { } connectionString)
            _connection = new MySqlConnection(connectionString);
    }

    public MySqlConnection GetConnection()
    {
        if (_connection.State == System.Data.ConnectionState.Closed)
        {
            _connection.Open();
        }
        return _connection;
    }
}