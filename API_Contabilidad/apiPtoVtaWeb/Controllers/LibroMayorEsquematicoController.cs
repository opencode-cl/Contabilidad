using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model.Forms;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LibroMayorEsquematicoController : ControllerBase
    {
        private readonly ILibroMayorEsquematicoRepository _repository;

        public LibroMayorEsquematicoController(ILibroMayorEsquematicoRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetLibroMayorEsquematicoData([FromQuery] LibroMayorEsquematicoForm form)
        {
            return Ok(await _repository.LibroMayorEsquematicoData(form.Empresa,form.Periodo,form.Mes,form.CuentaInicial,form.CuentaFinal));
        }

    }
}
