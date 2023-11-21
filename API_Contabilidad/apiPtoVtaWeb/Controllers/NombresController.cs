using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NombresController : ControllerBase
    {
        private readonly INombresRepository _repository;
        public NombresController(INombresRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNombres()
        {
            return Ok(await _repository.GetAllNombres());
        }

        [HttpGet("{codigo}")]
        public async Task<IActionResult> GetNombre(int codigo)
        {
            return Ok(await _repository.GetNombre(codigo));
        }

        [HttpPost]
        public async Task<IActionResult> CreateNombre([FromBody] Nombres nombre)
        {

            if (nombre == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var created = await _repository.InsertNombres(nombre);
            return Created("created", created);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateGlosa([FromBody] Nombres nombre)
        {
            if (nombre == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            await _repository.UpdateNombres(nombre);
            return NoContent();

        }

        [HttpDelete("{codigo}")]
        public async Task<ActionResult> DeleteNombre(int codigo)
        {
            await _repository.DeleteNombres(codigo);
            return NoContent();
        }

    }
}
