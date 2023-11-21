using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlujosController : ControllerBase
    {
        private readonly IFlujosRepository _repository;
        public FlujosController(IFlujosRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFlujos()
        {
            return Ok(await _repository.GetAllFlujos());
        }

        [HttpGet("{referencia}")]
        public async Task<IActionResult> GetFlujo(int referencia)
        {
            return Ok(await _repository.GetFlujo(referencia));
        }

        [HttpPost]
        public async Task<IActionResult> CreateGlosa([FromBody] Flujo flujo)
        {

            if (flujo == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var created = await _repository.InsertFlujo(flujo);
            return Created("created", created);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateFlujo([FromBody] Flujo flujo)
        {
            if (flujo == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            await _repository.UpdateFlujo(flujo);
            return NoContent();

        }

        [HttpDelete("{referencia}")]
        public async Task<ActionResult> DeleteFlujo(int referencia)
        {
            await _repository.DeleteFlujo(referencia);
            return NoContent();
        }

    }
}
