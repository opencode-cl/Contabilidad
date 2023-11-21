using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model.Forms;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Balance8ColumnasController : ControllerBase
    {
        private readonly IBalance8ColumnasRepository _repository;

        public Balance8ColumnasController(IBalance8ColumnasRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetBalance8ColumnasData([FromQuery] Balance8ColumnasForm form)
        {
            return Ok(await _repository.BalanceData(form.Empresa,form.Periodo,form.FechaCorte,form.Acumulado, form.IFRS));
        }

        [HttpGet("clasificado")]
        public async Task<IActionResult> GetBalance8ColumnasClasificadoData([FromQuery] Balance8ColumnasForm form)
        {
            return Ok(await _repository.BalanceClasificadoData(form.Empresa, form.Periodo, form.FechaCorte, form.Acumulado, form.IFRS));
        }
    }
}
