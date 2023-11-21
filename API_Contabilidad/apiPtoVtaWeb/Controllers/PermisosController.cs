using apiPtoVtaWeb.Data.Repositories.Interface;
using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermisosController : ControllerBase
    {
        private readonly IPermisosRepository _repository;
        public PermisosController(IPermisosRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPermisos()
        {
            return Ok(await _repository.GetAllPermisos());
        }

        [HttpPut]
        public async Task<IActionResult> UpdatePermiso([FromBody] Permiso permiso)
        {
            if (permiso == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            await _repository.UpdatePermiso(permiso);
            return NoContent();

        }

    }
}
