using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories
{
    public class NombresRepository : INombresRepository
    {

        private readonly InventoryDbContext _connectionManager;
        public NombresRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }
        public async Task<bool> DeleteNombres(int codigo)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM nombres WHERE codigo = @Codigo";

                var result = await db.ExecuteAsync(sql, new { Codigo = codigo });
                return result > 0;
            }
        }

        public async Task<IEnumerable<Nombres>> GetAllNombres()
        {
            using (var db = _connectionManager.GetConnection())
            {

                var sql = @"SELECT codigo, dv, nombre, direccion, ciudad, comuna, 
                            telefonos, fax, email, giro, tipo, banco, tipocuenta, 
                            emailintercambio, condiciones FROM nombres";
                return await db.QueryAsync<Nombres>(sql, new { });
            }
        }

        public async Task<Nombres> GetNombre(int codigo)
        {
            using (var db = _connectionManager.GetConnection())
            {

                var sql = @"SELECT codigo, dv, nombre, direccion, ciudad, comuna, 
                            telefonos, fax, email, giro, tipo, banco, tipocuenta, 
                            emailintercambio, condiciones FROM nombres 
                            WHERE codigo = @Codigo";
                return await db.QueryFirstOrDefaultAsync<Nombres>(sql, new { Codigo = codigo });
            }
        }

        public async Task<bool> InsertNombres(Nombres nombre)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO nombres(codigo, dv, nombre, direccion, ciudad, comuna, giro, telefonos, 
                            fax, email, emailintercambio, banco, nrocuenta, tipocuenta, condiciones) 
                            VALUES(@Codigo, @Dv, @Nombre, @Direccion, @Ciudad, @Comuna, @Giro, @Telefonos, 
                            @Fax, @Email, @Emailintercambio, @Banco, @Nrocuenta, @Tipocuenta, @Condiciones)";

                var result = await db.ExecuteAsync(sql, 
                    new { Codigo = nombre.Codigo,
                          Dv = nombre.Dv, 
                          Nombre = nombre.Nombre,
                          Direccion = nombre.Direccion,
                          Ciudad = nombre.Ciudad,
                          Comuna = nombre.Comuna,
                          Giro = nombre.Giro,
                          Telefonos = nombre.Telefonos,
                          Fax= nombre.Fax,
                          Email = nombre.Email,
                          Emailintercambio = nombre.Emailintercambio,
                          Banco = nombre.Banco,
                          Nrocuenta = nombre.Nrocuenta,
                          Tipocuenta = nombre.Tipocuenta,
                          Condiciones = nombre.Condiciones });
                return result > 0;
            }
        }

        public async Task<bool> UpdateNombres(Nombres nombre)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"UPDATE nombres 
                            SET nombre = @Nombre, direccion = @Direccion, ciudad = @Ciudad, 
                            comuna= @Comuna, giro = @Giro, telefonos = @Telefonos, fax = @Fax,  
                            email = @Email, emailintercambio = @Emailintercambio, banco = @Banco,  
                            nrocuenta = @Nrocuenta, tipocuenta = @Tipocuenta, condiciones = @Condiciones
                            WHERE codigo = @Codigo";

                var result = await db.ExecuteAsync(sql, 
                    new { Codigo = nombre.Codigo,
                          Nombre = nombre.Nombre,
                          Direccion = nombre.Direccion,
                          Ciudad = nombre.Ciudad,
                          Comuna = nombre.Comuna,
                          Giro = nombre.Giro,
                          Telefonos = nombre.Telefonos,
                          Fax= nombre.Fax,
                          Email = nombre.Email,
                          Emailintercambio = nombre.Emailintercambio,
                          Banco = nombre.Banco,
                          Nrocuenta = nombre.Nrocuenta,
                          Tipocuenta = nombre.Tipocuenta,
                          Condiciones = nombre.Condiciones });

                return result > 0;
            }
        }
    }
}
