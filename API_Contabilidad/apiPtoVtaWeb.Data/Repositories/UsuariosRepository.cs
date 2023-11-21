using System;
using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using apiPtoVtaWeb.Data.Repositories.Interface;

namespace apiPtoVtaWeb.Data.Repositories
{
    public class UsuariosRepository : IUsuariosRepository
    {
        private readonly InventoryDbContext _connectionManager;
        public UsuariosRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<bool> DeleteUsuario(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM usuarios WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Referencia = referencia });
                return result > 0;
            }
        }

        public async Task<IEnumerable<Usuario>> GetUsuarios()
        {
            using(var db = _connectionManager.GetConnection()){
                var sql = @"SELECT referencia, codigo, clave, nombre, opciones FROM usuarios";
                return await db.QueryAsync<Usuario>(sql, new { });
            }
        }

        public async Task<bool> InsertUsuario(Usuario usuario)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO usuarios(codigo, clave, nombre, opciones) 
                                        VALUES(@Codigo, @Clave, @Nombre, @Opciones)";

                var result = await db.ExecuteAsync(sql,
                    new
                    {
                        Codigo = usuario.Codigo,
                        Nombre = usuario.Nombre,
                        Clave = usuario.Clave,
                        Opciones = usuario.Opciones
                    });
                return result > 0;
            }
        }

        public async Task<bool> LoginUser(UserLogin user)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT 1 FROM usuarios WHERE codigo = @Codigo AND clave = @Clave LIMIT 1";

                var result = await db.QueryAsync<int>(sql, new { Codigo = user.Codigo , Clave = user.Clave});
                return result.Any();
            }
        }

        public async Task<bool> UpdateUsuario(Usuario usuario)
        {
             using (var db = _connectionManager.GetConnection())
            {
                var sql = @"UPDATE usuarios SET codigo = @Codigo, clave = @Clave, nombre = @Nombre, opciones = @Opciones 
                            WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql,
                            new
                            {
                                Referencia = usuario.Referencia,
                                Codigo = usuario.Codigo,
                                Clave = usuario.Clave,
                                Opciones = usuario.Opciones,
                                Nombre = usuario.Nombre
                            });
                return result > 0;
            }
        }

         public async Task<bool> AddEmpresa(UsuariosEmpresas empresa)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO usuariosd(codigo, empresa, nempresa) 
                                        VALUES(@Codigo, @Empresa, @Nempresa)";

                var result = await db.ExecuteAsync(sql,
                    new
                    {
                        Codigo = empresa.Codigo,
                        Empresa = empresa.Empresa,
                        Nempresa = empresa.Nempresa,
                    });
                return result > 0;
            }
        }
        public async Task<bool> AddRegistro(Registro registro)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO registro(equipo,usuario,empresa, periodo, fecha, mes, menu,opcion) 
                                        VALUES(@Equipo,@Usuario,@Empresa, @Periodo,@Fecha, @Mes, @Menu, @Opcion)";

                var result = await db.ExecuteAsync(sql,
                    new
                    {
                        Equipo =registro.Equipo,
                        Usuario =registro.Usuario,
                        Empresa = registro.Empresa,
                        Periodo = registro.Periodo,
                        Fecha = registro.Fecha,
                        Mes = registro.Mes,
                        Menu=registro.Menu,
                        Opcion=registro.Opcion
                    });
                return result > 0;
            }
        }

        public async Task<Registro> GetLastRegistro(string usuario)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT equipo,fecha,usuario,empresa,sucursal,periodo,mes,menu,opcion
                    FROM registro
                    WHERE usuario = @Usuario
                    ORDER BY fecha DESC 
                    LIMIT 1";

                // Otra opción para SQL Server es utilizar la cláusula TOP 1 en lugar de LIMIT 1

                var result = await db.QueryFirstOrDefaultAsync<Registro>(sql, new { Usuario = usuario });
                return result;
            }
        }

        public async Task<bool> DeleteEmpresa(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM usuariosd WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Referencia = referencia });
                return result > 0;
            }
        }

        public async Task<IEnumerable<UsuariosEmpresas>> GetEmpresas(string codigo)
        {
            using(var db = _connectionManager.GetConnection()){
                var sql = @"SELECT referencia, codigo, empresa, nempresa FROM usuariosd WHERE codigo = @Codigo";
                return await db.QueryAsync<UsuariosEmpresas>(sql, new { Codigo = codigo });
            }
        }
    }
}
