using apiPtoVtaWeb.Data.Repositories.Interface;
using apiPtoVtaWeb.Model;
using Dapper;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZstdSharp.Unsafe;

namespace apiPtoVtaWeb.Data.Repositories
{
    public class EmpresaRepository : IEmpresaRepository
    {

        private readonly InventoryDbContext  _connectionManager;

        public EmpresaRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }   

        public async Task<bool> DeleteEmpresa(int codigo)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM empresas WHERE codigo = @Codigo";

                var result = await db.ExecuteAsync(sql, new { Codigo = codigo });
                return result > 0;
            }
        }

        public async Task<IEnumerable<Empresa>> GetAllEmpresas()
        {
            using (var db = _connectionManager.GetConnection())
            {

            var sql = @"SELECT codigo, rut, dv, nombre, direccion, ciudad, comuna, telefono, giro, email, password, smtp,
                        imap, emailcorp, puerto, rutusuariosii, dvusuariosii, codacteco, codsucsii, nomsucsii, fechares, numerores,
                        ppm, replegal, rutreplegal, dvrutreplegal 
                        FROM empresas";

            return await db.QueryAsync<Empresa>(sql, new { });
            }
        }

        public async Task<Empresa> GetEmpresaDetails(int codigo)
        {
            using (var db = _connectionManager.GetConnection())
            {

            var sql = @"SELECT codigo, rut, dv, nombre, direccion, ciudad, comuna, telefono, giro, email, password, smtp,
                        imap, emailcorp, puerto, rutusuariosii, dvusuariosii, codacteco, codsucsii, nomsucsii, fechares, numerores,
                        ppm, replegal, rutreplegal, dvrutreplegal 
                        FROM empresas 
                        WHERE codigo = @Codigo";

            return await db.QueryFirstOrDefaultAsync<Empresa>(sql, new { Codigo = codigo });
            }
        }

    public async Task<bool> InsertEmpresa(Empresa empresa)
    {
        using (var db = _connectionManager.GetConnection())
        {
            var sql = @"INSERT INTO empresas(codigo, rut, dv, nombre, direccion, ciudad, comuna, telefono, giro, email, password, smtp,
                        imap, emailcorp, puerto, rutusuariosii, dvusuariosii, codacteco, codsucsii, nomsucsii, fechares, numerores,
                        ppm, replegal, rutreplegal, dvrutreplegal)
                        VALUES(@Codigo, @Rut, @Dv, @Nombre, @Direccion, @Ciudad, @Comuna, @Telefono, @Giro, @Email, @Password, @Smtp,
                        @Imap, @EmailCorp, @Puerto, @RutUsuarioSii, @DvUsuarioSii, @CodActeco, @CodSucSii, @NomSucSii, @FechaRes, @NumeroRes,
                        @Ppm, @RepLegal, @RutRepLegal, @DvRutRepLegal)";

            var result = await db.ExecuteAsync(sql, new
            {
                Codigo = empresa.Codigo,
                Rut = empresa.Rut,
                Dv = empresa.Dv,
                Nombre = empresa.Nombre,
                Direccion = empresa.Direccion,
                Ciudad = empresa.Ciudad,
                Comuna = empresa.Comuna,
                Telefono = empresa.Telefono,
                Giro = empresa.Giro,
                Email = empresa.Email,
                Password = empresa.Password,
                Smtp = empresa.Smtp,
                Imap = empresa.Imap,
                EmailCorp = empresa.Emailcorp,
                Puerto = empresa.Puerto,
                RutUsuarioSii = empresa.Rutusuariosii,
                DvUsuarioSii = empresa.Dvusuariosii,
                CodActeco = empresa.Codacteco,
                CodSucSii = empresa.Codsucsii,
                NomSucSii = empresa.Nomsucsii,
                FechaRes = empresa.Fechares,
                NumeroRes = empresa.Numerores,
                Ppm = empresa.Ppm,
                RepLegal = empresa.Replegal,
                RutRepLegal = empresa.Rutreplegal,
                DvRutRepLegal = empresa.Dvrutreplegal
            });

            return result > 0;
        }
    }

public async Task<bool> UpdateEmpresa(Empresa empresa)
{
    using (var db = _connectionManager.GetConnection())
    {
        var sql = @"UPDATE empresas 
                    SET rut = @Rut, dv = @Dv, nombre = @Nombre, direccion = @Direccion, ciudad = @Ciudad, comuna = @Comuna,
                        telefono = @Telefono, giro = @Giro, email = @Email, password = @Password, smtp = @Smtp,
                        imap = @Imap, emailcorp = @EmailCorp, puerto = @Puerto, rutusuariosii = @RutUsuarioSii,
                        dvusuariosii = @DvUsuarioSii, codacteco = @CodActeco, codsucsii = @CodSucSii, nomsucsii = @NomSucSii,
                        fechares = @FechaRes, numerores = @NumeroRes, ppm = @Ppm, replegal = @RepLegal,
                        rutreplegal = @RutRepLegal, dvrutreplegal = @DvRutRepLegal
                    WHERE codigo = @Codigo";

        var result = await db.ExecuteAsync(sql, new
        {
            Rut = empresa.Rut,
            Dv = empresa.Dv,
            Nombre = empresa.Nombre,
            Direccion = empresa.Direccion,
            Ciudad = empresa.Ciudad,
            Comuna = empresa.Comuna,
            Telefono = empresa.Telefono,
            Giro = empresa.Giro,
            Email = empresa.Email,
            Password = empresa.Password,
            Smtp = empresa.Smtp,
            Imap = empresa.Imap,
            EmailCorp = empresa.Emailcorp,
            Puerto = empresa.Puerto,
            RutUsuarioSii = empresa.Rutusuariosii,
            DvUsuarioSii = empresa.Dvusuariosii,
            CodActeco = empresa.Codacteco,
            CodSucSii = empresa.Codsucsii,
            NomSucSii = empresa.Nomsucsii,
            FechaRes = empresa.Fechares,
            NumeroRes = empresa.Numerores,
            Ppm = empresa.Ppm,
            RepLegal = empresa.Replegal,
            RutRepLegal = empresa.Rutreplegal,
            DvRutRepLegal = empresa.Dvrutreplegal,
            Codigo = empresa.Codigo
        });

        return result > 0;
    }
}
    }
}
