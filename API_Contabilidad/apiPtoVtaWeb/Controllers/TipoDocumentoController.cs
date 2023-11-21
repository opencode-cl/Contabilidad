using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TipoDocumentoController : ControllerBase
    {
        private readonly ITipoDocumentoRepository _tipoDocumentoRepository;

        public TipoDocumentoController(ITipoDocumentoRepository tipoDocumentoRepository)
        {
            _tipoDocumentoRepository = tipoDocumentoRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _tipoDocumentoRepository.GetAllTipoDocumento());
        }

        [HttpGet("{referencia}")]

        public async Task<IActionResult> GetOne(int referencia)
        {
            return Ok(await _tipoDocumentoRepository.GetTipoDocumento(referencia));
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] TipoDocumento tipoDocumento)
        {
            if (tipoDocumento == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _tipoDocumentoRepository.InsertTipoDocumento(tipoDocumento);
            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] TipoDocumento tipoDocumento)
        {
            if (tipoDocumento == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _tipoDocumentoRepository.UpdateTipoDocumento(tipoDocumento);
            return NoContent();
        }

        [HttpDelete("{referencia}")]
        public async Task<IActionResult> Delete(int referencia)
        {
            await _tipoDocumentoRepository.DeleteTipoDocumento(referencia);
            return NoContent();
        }

    }
}
