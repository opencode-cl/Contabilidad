using apiPtoVtaWeb.Data.Repositories.Interface;
using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ObrasController : ControllerBase
    {
        private readonly IObrasRepository _repository;
        public ObrasController(IObrasRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllObras()
        {
            return Ok(await _repository.GetAllObras());
        }

        [HttpGet("empresa/{empresa}")]
        public async Task<IActionResult> GetObraEmpresa(int empresa)
        {
            return Ok(await _repository.GetAllObrasEmpresa(empresa));
        }

        [HttpGet("{referencia}")]
        public async Task<IActionResult> GetObra(int referencia)
        {
            return Ok(await _repository.GetObraDetails(referencia));
        }

        [HttpPost]
        public async Task<IActionResult> CreateObra([FromBody] Obra obra)
        {

            if (obra == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var created = await _repository.InsertObra(obra);
            return Created("created", created);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateGlosa([FromBody] Obra obra)
        {
            if (obra == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            await _repository.UpdateObra(obra);
            return NoContent();

        }

        [HttpDelete("{referencia}")]
        public async Task<ActionResult> DeleteGrupo(int referencia)
        {
            await _repository.DeleteObra(referencia);
            return NoContent();
        }

    }
}
