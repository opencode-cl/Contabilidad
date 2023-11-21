using apiPtoVtaWeb.Data.Repositories.Interface;
using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CodigosCPController : ControllerBase
    {

        private readonly ICodigosCPRepository _repository;

        public CodigosCPController(ICodigosCPRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCodigosCP()
        {
            return Ok(await _repository.GetAllCodigos());
        }

        [HttpGet("empresa/{empresa}")]
        public async Task<IActionResult> GetAllCodigosCPEmpresa(int empresa)
        {
            return Ok(await _repository.GetAllCodigosEmpresa(empresa));
        }

        [HttpGet("{referencia}")]
        public async Task<IActionResult> GetCodigoCP(int referencia)
        {
            return Ok(await _repository.GetCodigoDetails(referencia));
        }

        [HttpPost]
        public async Task<IActionResult> CreateCodigoCP([FromBody] CodigoCP codigocp)
        {

            if(codigocp == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var created = await _repository.InsertCodigo(codigocp);
            return Created("created", created);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateCodigoCP([FromBody] CodigoCP codigocp)
        {
            if (codigocp == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            await _repository.UpdateCodigo(codigocp);
            return NoContent(); 
        }

        [HttpDelete("{referencia}")]
        public async Task<IActionResult> DeleteCodigoCP(int referencia)
        {
            await _repository.DeleteCodigo(referencia);
            return NoContent();
        }

    }
}
