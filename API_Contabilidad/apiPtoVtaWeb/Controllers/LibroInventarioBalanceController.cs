using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model.Forms;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LibroInventarioBalanceController : ControllerBase
    {

        private readonly ILibroInventarioBalanceRepository _repository;

        public LibroInventarioBalanceController(ILibroInventarioBalanceRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetLibroInventarioBalanceData([FromQuery] LibroInventarioBalanceForm form)
        {
            return Ok(await _repository.LibroData(form.Empresa, form.Periodo, form.FechaCorte, form.CuentaInicio, form.CuentaFinal));
        }

    }
}
