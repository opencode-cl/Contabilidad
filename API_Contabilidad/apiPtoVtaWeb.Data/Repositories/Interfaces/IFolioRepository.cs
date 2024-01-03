using API_Contabilidad.Model;
using apiPtoVtaWeb.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interfaces
{
    public interface IFoliosRepository
    {
        Task<IEnumerable<Folio>> GetAllFolios();
        Task<IEnumerable<Folio>> GetFoliosPeriodo(int empresa, int periodo, int mes, string tipo);
        Task<IEnumerable<Linea>> GetLineas(int empresa, int periodo, int mes, string tipo, int cuenta);
        Task<Folio> GetFolioDetails(int referencia);
        Task<bool> InsertFolio(Folio folio);
        Task<bool> UpdateFolio(Folio folio);
        Task<bool> DeleteFolio(int referencia);
        Task<bool> InsertFolioCompleto(FolioCompleto folio);
        Task<bool> UpdateFolioCompleto(FolioCompleto folio);
        Task<int> GetLastFolioNum(int empresa, int periodo, int mes, string tipo);
    }
}