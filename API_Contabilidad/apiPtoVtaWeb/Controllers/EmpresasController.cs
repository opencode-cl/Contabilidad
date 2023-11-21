using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using apiPtoVtaWeb.Model;
using apiPtoVtaWeb.Data.Repositories.Interface;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpresasController : ControllerBase
    {
        private readonly IEmpresaRepository _empresaRepository;

        public EmpresasController(IEmpresaRepository empresaRepository)
        {
            _empresaRepository = empresaRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEmpresas()
        {
            return Ok(await _empresaRepository.GetAllEmpresas());
        }

        [HttpGet("{codigo}")]
        public async Task<IActionResult> GetEmpresaDetails(int codigo)
        {
            return Ok(await _empresaRepository.GetEmpresaDetails(codigo));
        }

        [HttpPost]
        public async Task<IActionResult> CreateEmpresa([FromBody] Empresa empresa)
        {
            if (empresa == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var created = await _empresaRepository.InsertEmpresa(empresa);
            return Created("created", created);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateEmpresa([FromBody] Empresa empresa)
        {
            if (empresa == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            await _empresaRepository.UpdateEmpresa(empresa);
            return NoContent();

        }

        [HttpDelete("{codigo}")]
        public async Task<IActionResult> DeleteEmpresa(int codigo)
        {
            await _empresaRepository.DeleteEmpresa(codigo);
            return NoContent();
        }

    }
}
