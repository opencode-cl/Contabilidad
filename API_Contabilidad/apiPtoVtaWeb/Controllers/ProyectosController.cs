using apiPtoVtaWeb.Data.Repositories.Interface;
using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProyectosController : ControllerBase
    {
        private readonly IProyectosRepository _repository;
        public ProyectosController(IProyectosRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProyectos()
        {
            return Ok(await _repository.GetAllProyectos());
        }

        [HttpGet("empresa/{empresa}")]
        public async Task<IActionResult> GetProyectosEmpresas(int empresa)
        {
            return Ok(await _repository.GetAllProyectosEmpresa(empresa));
        }

        [HttpGet("{codigo}")]
        public async Task<IActionResult> GetProyecto(int codigo)
        {
            return Ok(await _repository.GetProyectoDetails(codigo));
        }

        [HttpPost]
        public async Task<IActionResult> CreateProyecto([FromBody] Proyecto proyecto)
        {

            if (proyecto == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var created = await _repository.InsertProyecto(proyecto);
            return Created("created", created);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateProyecto([FromBody] Proyecto proyecto)
        {
            if (proyecto == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            await _repository.UpdateProyecto(proyecto);
            return NoContent();

        }

        [HttpDelete("{codigo}")]
        public async Task<ActionResult> DeleteProyecto(int codigo)
        {
            await _repository.DeleteProyecto(codigo);
            return NoContent();
        }

    }
}
