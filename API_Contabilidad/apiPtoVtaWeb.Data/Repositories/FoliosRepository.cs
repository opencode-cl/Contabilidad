using API_Contabilidad.Model;
using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Dapper;
using MySqlX.XDevAPI.Common;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories
{
    public class FoliosRepository : IFoliosRepository
    {
        private readonly InventoryDbContext _connectionManager;

        public FoliosRepository(InventoryDbContext connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public async Task<bool> DeleteFolio(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"DELETE FROM folios WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, new { Referencia = referencia });
                return result > 0;
            }
        }

        public async Task<IEnumerable<Folio>> GetAllFolios()
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT * FROM folios";
                return await db.QueryAsync<Folio>(sql);
            }
        }

        public async Task<Folio> GetFolioDetails(int referencia)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT * FROM folios WHERE referencia = @Referencia";
                return await db.QueryFirstOrDefaultAsync<Folio>(sql, new { Referencia = referencia });
            }
        }

        public async Task<IEnumerable<Folio>> GetFoliosPeriodo(int empresa, int periodo, int mes, string tipo)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT * FROM folios WHERE empresa = @Empresa AND tipo = @Tipo 
                            AND periodo = @Periodo AND SUBSTRING(numero, 1, LENGTH(numero)-4) = @Mes";
                return await db.QueryAsync<Folio>(sql, new { Empresa = empresa, Periodo = periodo, Mes = mes, Tipo = tipo });
            }
        }

        public async Task<IEnumerable<Linea>> GetLineas(int empresa, int periodo, int mes, string tipo, int cuenta)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT * FROM lineas WHERE empresa = @Empresa AND tipo = @Tipo 
                            AND periodo = @Periodo AND SUBSTRING(numero, 1, LENGTH(numero)-4) = @Mes AND numero = @Numero";
                return await db.QueryAsync<Linea>(sql, new { Empresa = empresa, Tipo = tipo, Periodo = periodo, Mes = mes, Numero = cuenta });
            }
        }

        public async Task<bool> InsertFolio(Folio folio)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"INSERT INTO folios(periodo, empresa, tipo, numero, fecha, glosa, rut, dv, nombre, cuenta, 
                            nodoc, nodocl, vencim, valor, cruzado, alportador, alaorden, mescrito, mescrito2, debe, haber, 
                            anulado, usuario, fechareg, referencia, norma, local, tipocent) 
                            VALUES(@Periodo, @Empresa, @Tipo, @Numero, @Fecha, @Glosa, @Rut, @DV, @Nombre, @Cuenta, @NoDoc, 
                            @NoDocL, @Vencimiento, @Valor, @Cruzado, @AlPortador, @AlaOrden, @MesCrito, @MesCrito2, @Debe, 
                            @Haber, @Anulado, @Usuario, @FechaReg, @Referencia, @Norma, @Local, @TipoCentro)";

                var result = await db.ExecuteAsync(sql, folio);
                return result > 0;
            }
        }

        public async Task<bool> InsertFolioCompleto(FolioCompleto folio)
        {   

            var queryInsertFolio = @"INSERT INTO folios(periodo, empresa, numero, fecha, fechareg, glosa, nombre, rut, dv, tipo, usuario, vencim, valor, nodoc, debe, haber) 
                            VALUES(@Periodo, @Empresa, @Numero, @Fecha, @FechaReg, @Glosa, @Nombre, @Rut, @DV, @Tipo, @Usuario, @Vencimiento, @Valor, @NoDoc, @Debe, @Haber)";

            var queryInsertLinea = @"INSERT INTO lineas(periodo, empresa, tipo, numero, fecha, cuenta, obra, item, auxiliar, 
                            td, nodoc, fedoc, feven, debe, haber, glosa, flujo, usuario, fechareg, referencia, dv, codigocp, nroref) 
                            VALUES(@Periodo, @Empresa, @Tipo, @Numero, @Fecha, @Cuenta, @Obra, @Item, @Auxiliar, 
                            @Td, @NoDoc, @FeDoc, @FeVen, @Debe, @Haber, @Glosa, @Flujo, @Usuario, @FechaReg, 
                            @Referencia, @DV, @CodigoCP, @NroRef)";

            using(var db = _connectionManager.GetConnection())
            {
                using (var transaction = db.BeginTransaction())
                {
                     Folio folioItem = folio.folio;
                    var result = await db.ExecuteAsync(queryInsertFolio, new
                    {
                        Periodo = folioItem.Periodo,
                        Empresa = folioItem.Empresa,
                        Numero = folioItem.Numero,
                        Fecha = folioItem.Fecha,
                        FechaReg = folioItem.FechaReg,
                        Glosa = folioItem.Glosa,
                        Nombre = folioItem.Nombre,
                        Rut = folioItem.Rut,
                        DV = folioItem.DV,
                        Tipo = folioItem.Tipo,
                        Usuario = folioItem.Usuario,
                        Vencimiento = folioItem.Vencimiento,
                        Valor = folioItem.Valor,
                        NoDoc = folioItem.NoDoc,
                        Debe = folioItem.Debe,
                        Haber = folioItem.Haber
                    }, transaction: transaction);

                    string fechaLinea = folioItem.Periodo + "-" + folioItem.FechaReg.Split("-")[1] + "-01";


                    foreach (Linea linea in folio.lineas)
                    {
                        linea.Fecha = fechaLinea;
                        if(linea.NroRef == null)
                        {
                            linea.NroRef = "";
                        }

                        var resultLinea = await db.ExecuteAsync(queryInsertLinea, linea, transaction: transaction);
                    }

                    transaction.Commit();

                    return result > 0;
                }
            }
        }

        public async Task<bool> UpdateFolio(Folio folio)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"UPDATE folios 
                            SET periodo = @Periodo, empresa = @Empresa, tipo = @Tipo, numero = @Numero, fecha = @Fecha, 
                            glosa = @Glosa, rut = @Rut, dv = @DV, nombre = @Nombre, cuenta = @Cuenta, nodoc = @NoDoc, 
                            nodocl = @NoDocL, vencim = @Vencimiento, valor = @Valor, cruzado = @Cruzado, alportador = @AlPortador, 
                            alaorden = @AlaOrden, mescrito = @MesCrito, mescrito2 = @MesCrito2, debe = @Debe, haber = @Haber, 
                            anulado = @Anulado, usuario = @Usuario, fechareg = @FechaReg, norma = @Norma, local = @Local, 
                            tipocent = @TipoCentro
                            WHERE referencia = @Referencia";

                var result = await db.ExecuteAsync(sql, folio);
                return result > 0;
            }
        }

        public Task<bool> UpdateFolioCompleto(FolioCompleto folio)
        {
            throw new NotImplementedException();
        }
    }
}