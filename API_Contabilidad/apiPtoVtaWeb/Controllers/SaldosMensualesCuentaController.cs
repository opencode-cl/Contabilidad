using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model.Forms;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaldosMensualesCuentaController : ControllerBase
    {

        private readonly ISaldosMensualesCuentaRepository _repository;
        public SaldosMensualesCuentaController(ISaldosMensualesCuentaRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetSaldosMensualesCuentaData([FromQuery] RangoCuentasForm form)
        {
            return Ok(await _repository.SaldosMensualesCuentaData(form.Empresa, form.Periodo, form.Mes, form.Cuentai, form.Cuentaf));
        }

    }
}
