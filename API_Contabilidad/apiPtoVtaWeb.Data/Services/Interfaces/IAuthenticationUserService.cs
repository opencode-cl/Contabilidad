using apiPtoVtaWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Data.Services.Interfaces
{
    public interface IAuthenticationUserService
    {
        Task<Authentication> LoginMasterUser(AuthLogin user);
    }
}
