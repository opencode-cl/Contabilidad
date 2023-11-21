using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CodigosFinancierosController : ControllerBase
    {
        private readonly ICodigoFinancieroRepository _codigoFinancieroRepository;

        public CodigosFinancierosController(ICodigoFinancieroRepository codigoFinancieroRepository)
        {
            _codigoFinancieroRepository = codigoFinancieroRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() {
            return Ok(await _codigoFinancieroRepository.GetAllCodigosFinancieros());
        }

        [HttpGet("{referencia}")]

        public async Task<IActionResult> GetOne(int referencia)
        {
            return Ok(await _codigoFinancieroRepository.GetCodigoFinancieroById(referencia));
        }

        [HttpPost()]
        public async Task<IActionResult> Insert([FromBody] CodigoFinanciero codigo)
        {
            if(codigo == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _codigoFinancieroRepository.InsertCodigoFinanciero(codigo);
            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] CodigoFinanciero codigo)
        {
            if (codigo == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _codigoFinancieroRepository.EditCodigoFinanciero(codigo);
            return NoContent();
        }

        [HttpDelete("{referencia}")]
        public async Task<IActionResult> Delete(int referencia)
        {
            await _codigoFinancieroRepository.DeleteCodigoFinanciero(referencia);
            return NoContent();
        }

    }
}
