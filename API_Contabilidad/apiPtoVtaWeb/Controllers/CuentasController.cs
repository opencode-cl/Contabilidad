using apiPtoVtaWeb.Data.Repositories.Interface;
using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CuentasController : ControllerBase
    {
        private readonly ICuentasRepository _cuentaRepository;

        public CuentasController(ICuentasRepository cuentaRepository)
        {
            _cuentaRepository = cuentaRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCuentas()
        {
            return Ok(await _cuentaRepository.GetAllCuentas());
        }

        [HttpGet("resumen")]
        public async Task<IActionResult> GetAllCuentasResumidas()
        {
            return Ok(await _cuentaRepository.GetAllCuentasResumen());
        }

        [HttpGet("{referencia}")]
        public async Task<IActionResult> GetGlosa(int referencia)
        {
            return Ok(await _cuentaRepository.GetCuentaDetails(referencia));
        }

        [HttpPost]
        public async Task<IActionResult> CreateCuenta([FromBody] Cuenta cuenta)
        {

            if (cuenta == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var created = await _cuentaRepository.InsertCuenta(cuenta);
            return Created("created", created);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateCuenta([FromBody] Cuenta cuenta)
        {
            if (cuenta == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            await _cuentaRepository.UpdateCuenta(cuenta);
            return NoContent();

        }

        [HttpDelete("{referencia}")]
        public async Task<ActionResult> DeleteCuenta(int referencia)
        {
            await _cuentaRepository.DeleteCuenta(referencia);
            return NoContent();
        }
    }
}
