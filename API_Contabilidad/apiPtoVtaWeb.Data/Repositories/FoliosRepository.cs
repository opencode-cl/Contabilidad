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

        public async Task<int> GetLastFolioNum(int empresa, int periodo, int mes, string tipo)
        {
            using (var db = _connectionManager.GetConnection())
            {
                var sql = @"SELECT Numero FROM folios 
                    WHERE Empresa = @Empresa AND Tipo = @Tipo AND Periodo = @Periodo AND SUBSTRING(Numero, 1, LENGTH(Numero)-4) = @Mes
                    ORDER BY Numero DESC 
                    LIMIT 1";

                return await db.QueryFirstOrDefaultAsync<int?>(sql, new { Empresa = empresa, Tipo = tipo, Periodo = periodo, Mes = mes }) ?? 0;
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
            using (var db = _connectionManager.GetConnection())
            {
                using (var transaction = db.BeginTransaction())
                {
                    try
                    {
                        Folio folioItem = folio.folio;

                        // Verificar si la referencia es mayor a 0 para eliminar el folio existente
                        if (folioItem.Referencia > 0)
                        {
                            // Eliminar el folio existente
                            var deleteFolioQuery = @"DELETE FROM folios WHERE Referencia = @Referencia";
                            await db.ExecuteAsync(deleteFolioQuery, new
                            {
                                Referencia = folioItem.Referencia
                            }, transaction: transaction);

                            // Eliminar líneas asociadas al folio existente
                            var deleteLineasQuery = @"DELETE FROM lineas WHERE Empresa = @Empresa AND Periodo = @Periodo AND Tipo = @Tipo AND Numero = @Numero";
                            await db.ExecuteAsync(deleteLineasQuery, new
                            {
                                Empresa = folioItem.Empresa,
                                Periodo = folioItem.Periodo,
                                Tipo = folioItem.Tipo,
                                Numero = folioItem.Numero
                            }, transaction: transaction);
                            
                        }

                        // Insertar el nuevo folio
                        var insertFolioQuery = @"INSERT INTO folios(cuenta,periodo, empresa, numero, fecha, fechareg, glosa, nombre, rut, dv, tipo, usuario, vencim, valor, nodoc, debe, haber) 
                        VALUES(@Cuenta,@Periodo, @Empresa, @Numero, @Fecha, @FechaReg, @Glosa, @Nombre, @Rut, @DV, @Tipo, @Usuario, @Vencim, @Valor, @NoDoc, @Debe, @Haber)";
                        var result = await db.ExecuteAsync(insertFolioQuery, new
                        {
                            Periodo = folioItem.Periodo,
                            Empresa = folioItem.Empresa,
                            Numero = folioItem.Numero,
                            Fecha = folioItem.Fecha,
                            FechaReg = folioItem.FechaReg,
                            Glosa = folioItem.Glosa,
                            Nombre = folioItem.Nombre,
                            Rut = folioItem.Rut,
                            Cuenta = folioItem.Cuenta,
                            DV = folioItem.DV,
                            Tipo = folioItem.Tipo,
                            Usuario = folioItem.Usuario,
                            Vencim = folioItem.Vencim,
                            Valor = folioItem.Valor,
                            NoDoc = folioItem.NoDoc,
                            Debe = folioItem.Debe,
                            Haber = folioItem.Haber
                        }, transaction: transaction);

                        string fechaLinea = folioItem.Periodo + "-" + folioItem.FechaReg.Split("-")[1] + "-01";

                        // Insertar nuevas líneas
                        var insertLineaQuery = @"INSERT INTO lineas(periodo, empresa, tipo, numero, fecha, cuenta, obra, item, auxiliar, 
                            td, nodoc, fedoc, feven, debe, haber, glosa, flujo, usuario, fechareg, referencia, codigocp, nroref) 
                            VALUES(@Periodo, @Empresa, @Tipo, @Numero, @Fecha, @Cuenta, @Obra, @Item, @Auxiliar, 
                            @Td, @NoDoc, @FeDoc, @FeVen, @Debe, @Haber, @Glosa, @Flujo, @Usuario, @FechaReg, 
                            @Referencia, @CodigoCP, @NroRef)";

                        foreach (Linea linea in folio.lineas)
                        {
                            linea.Fecha = fechaLinea;
                            if (linea.NroRef == null)
                            {
                                linea.NroRef = "";
                            }

                            var resultLinea = await db.ExecuteAsync(insertLineaQuery, linea, transaction: transaction);
                        }

                        transaction.Commit();

                        return result > 0;
                    }
                    catch (Exception ex)
                    {
                        // Manejar la excepción y realizar un rollback
                        transaction.Rollback();
                        
                        Console.WriteLine($"Error: {ex.Message}");
                        throw; 
                    }
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