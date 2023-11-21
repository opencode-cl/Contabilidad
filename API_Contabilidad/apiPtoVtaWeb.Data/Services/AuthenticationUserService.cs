using apiPtoVtaWeb.Data.Services.Interfaces;
using apiPtoVtaWeb.Model;
using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Services
{
    public class AuthenticationUserService : IAuthenticationUserService
    {
        private readonly DatabaseConnectionManager _connectionManager;
        public AuthenticationUserService(DatabaseConnectionManager connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<Authentication> LoginMasterUser(AuthLogin user)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT nombre, email, conexion FROM usuarios_contabilidad WHERE email = @Email AND password = @Password LIMIT 1";

                return await db.QueryFirstOrDefaultAsync<Authentication>(sql, new { user.Email, user.Password });

            }
        }
    }
}
