using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GruposController : ControllerBase
    {
        private readonly IGruposRepository _repository;
        public GruposController(IGruposRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllGrupos()
        {
            return Ok(await _repository.GetAllGrupos());
        }

        [HttpGet("{referencia}")]
        public async Task<IActionResult> GetGrupo(int referencia)
        {
            return Ok(await _repository.GetGrupo(referencia));
        }

        [HttpPost]
        public async Task<IActionResult> CreateGrupo([FromBody] Grupo grupo)
        {

            if (grupo == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var created = await _repository.InsertGrupo(grupo);
            return Created("created", created);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateGlosa([FromBody] Grupo grupo)
        {
            if (grupo == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            await _repository.UpdateGrupo(grupo);
            return NoContent();

        }

        [HttpDelete("{referencia}")]
        public async Task<ActionResult> DeleteGrupo(int referencia)
        {
            await _repository.DeleteGrupo(referencia);
            return NoContent();
        }

    }
}
