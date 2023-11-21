using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GlosasController : ControllerBase
    {
        private readonly IGlosaRepository _repository;
        public GlosasController(IGlosaRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllGlosas()
        {
            return Ok(await _repository.GetAllGlosas());
        }

        [HttpGet("{referencia}")]
        public async Task<IActionResult> GetGlosa(int referencia)
        {
            return Ok(await _repository.GetGlosa(referencia));
        }

        [HttpPost]
        public async Task<IActionResult> CreateGlosa([FromBody] Glosa glosa)
        {

            if (glosa == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var created = await _repository.InsertGlosa(glosa);
            return Created("created", created);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateGlosa([FromBody] Glosa glosa)
        {
            if (glosa == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            await _repository.UpdateGlosa(glosa);
            return NoContent();

        }

        [HttpDelete("{referencia}")]
        public async Task<ActionResult> DeleteGlosa(int referencia)
        {
            await _repository.DeleteGlosa(referencia);
            return NoContent();
        }

    }
}
