using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interfaces
{
    public interface IItemesRepository
    {
        Task<IEnumerable<Itemes>> GetItemes();
        Task<IEnumerable<Itemes>> GetItemesEmpresa(int empresa);
        Task<Itemes> GetItemDetails(int referencia);
        Task<bool> InsertItemes(Itemes item);
        Task<bool> UpdateItemes(Itemes item);
        Task<bool> DeleteItem(int referencia);

        Task<IEnumerable<ItemesMaestro>> GetItemesMaestroEmpresa(int empresa);
        Task<ItemesMaestro> GetItemMaestroDetails(int referencia);
        Task<bool> InsertItemesMaestro(ItemesMaestro item);
        Task<bool> UpdateItemesMaestro(ItemesMaestro item);
        Task<bool> DeleteItemesMaestro(int referencia);

        Task<IEnumerable<ItemesCuentas>> GetItemesCuenta(int codigoItem);
        Task<ItemesCuentas> GetItemCuentaDetails(int referencia);
        Task<bool> InsertItemesCuenta(ItemesCuentas item);
        Task<bool> DeleteItemesCuenta(int referencia);
    }
}
