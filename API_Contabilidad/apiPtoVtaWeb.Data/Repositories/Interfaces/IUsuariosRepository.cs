using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Repositories.Interface
{
    public interface IUsuariosRepository
    {
        Task<bool> LoginUser(UserLogin user);

        Task<IEnumerable<Usuario>> GetUsuarios();
        Task<bool> DeleteUsuario(int referencia);
        Task<bool> UpdateUsuario(Usuario usuario); 
        Task<bool> InsertUsuario(Usuario usuario); 
        Task<IEnumerable<UsuariosEmpresas>> GetEmpresas(string codigo);
        Task<bool> AddEmpresa(UsuariosEmpresas empresa);
        Task<bool> DeleteEmpresa(int referencia);
        Task<bool> AddRegistro(Registro registro);
        Task<Registro> GetLastRegistro(string usuario);

    }
}
