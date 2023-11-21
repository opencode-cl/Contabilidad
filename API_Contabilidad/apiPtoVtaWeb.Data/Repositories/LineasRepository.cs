using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Dapper;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories
{
    public class LineasRepository : ILineasRepository
    {
        private readonly InventoryDbContext _connectionManager;

        public LineasRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<bool> DeleteLinea(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM lineas WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Referencia = referencia });
                return result > 0;
            }
        }

        public async Task<IEnumerable<Linea>> GetAllLineas()
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT * FROM lineas";
                return await db.QueryAsync<Linea>(sql);
            }
        }

        public async Task<Linea> GetLineaDetails(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT * FROM lineas WHERE referencia = @Referencia";
                return await db.QueryFirstOrDefaultAsync<Linea>(sql, new { Referencia = referencia });
            }
        }

        public async Task<IEnumerable<Linea>> GetLineasFolio(int numerofolio)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT * FROM lineas WHERE numero = @Numero";
                return await db.QueryAsync<Linea>(sql, new { Numero = numerofolio });
            }
        }

        public async Task<bool> InsertLinea(Linea linea)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO lineas(periodo, empresa, tipo, numero, fecha, cuenta, obra, item, partida, auxiliar, 
                            td, nodoc, nodocl, fedoc, feven, debe, haber, glosa, flujo, usuario, fechareg, referencia, 
                            norma, rut2, proyecto, dv, fuente, pptc, pptcasig, codigocp, nroref) 
                            VALUES(@Periodo, @Empresa, @Tipo, @Numero, @Fecha, @Cuenta, @Obra, @Item, @Partida, @Auxiliar, 
                            @Td, @NoDoc, @NoDocL, @FeDoc, @FeVen, @Debe, @Haber, @Glosa, @Flujo, @Usuario, @FechaReg, 
                            @Referencia, @Norma, @Rut2, @Proyecto, @DV, @Fuente, @PPTC, @PPTCAsig, @CodigoCP, @NroRef)";

                var result = await db.ExecuteAsync(sql, linea);
                return result > 0;
            }
        }

        public async Task<bool> UpdateLinea(Linea linea)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"UPDATE lineas 
                            SET periodo = @Periodo, empresa = @Empresa, tipo = @Tipo, numero = @Numero, fecha = @Fecha, 
                            cuenta = @Cuenta, obra = @Obra, item = @Item, partida = @Partida, auxiliar = @Auxiliar, 
                            td = @Td, nodoc = @NoDoc, nodocl = @NoDocL, fedoc = @FeDoc, feven = @FeVen, debe = @Debe, 
                            haber = @Haber, glosa = @Glosa, flujo = @Flujo, usuario = @Usuario, fechareg = @FechaReg, 
                            norma = @Norma, rut2 = @Rut2, proyecto = @Proyecto, dv = @DV, fuente = @Fuente, pptc = @PPTC, 
                            pptcasig = @PPTCAsig, codigocp = @CodigoCP, nroref = @NroRef 
                            WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, linea);
                return result > 0;
            }
        }
    }
}