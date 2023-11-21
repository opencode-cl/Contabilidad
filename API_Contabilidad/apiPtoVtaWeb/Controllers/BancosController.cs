using apiPtoVtaWeb.Data.Repositories.Interface;
using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BancosController : ControllerBase
    {
        private readonly IBancosRepository _repository;

        public BancosController(IBancosRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBancos()
        {
            return Ok(await _repository.GetAllBancos());
        }

        [HttpGet("{referencia}")]
        public async Task<IActionResult> GetBanco(int referencia)
        {
            return Ok(await _repository.GetBancoDetails(referencia));
        }

        [HttpPost]
        public async Task<IActionResult> CreateBanco([FromBody] Banco banco)
        {

            if (banco == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var created = await _repository.InsertBanco(banco);
            return Created("created", created);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateBanco([FromBody] Banco banco)
        {
            if (banco == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            await _repository.UpdateBanco(banco);
            return NoContent();

        }

        [HttpDelete("{referencia}")]
        public async Task<ActionResult> DeleteCuenta(int referencia)
        {
            await _repository.DeleteBanco(referencia);
            return NoContent();
        }
    }
}
