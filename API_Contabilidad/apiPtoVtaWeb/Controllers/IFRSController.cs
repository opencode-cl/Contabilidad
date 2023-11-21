using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using apiPtoVtaWeb.Data.Repositories;
using Microsoft.AspNetCore.Mvc.Formatters;
using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IFRSController : ControllerBase
    {
        private readonly IIFRSRepository _repository;
        public IFRSController(IIFRSRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllIFRS()
        {
            return Ok(await _repository.GetAllIFRS());
        }

        [HttpGet("{referencia}")]
        public async Task<IActionResult> GetIFRS(int referencia)
        {
            return Ok(await _repository.GetIFRS(referencia));
        }

        [HttpPost]
        public async Task<IActionResult> CreateIFRS([FromBody] IFRS ifrs)
        {

            if(ifrs == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var created = await _repository.InsertIFRS(ifrs);
            return Created("created", created);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateIFRS([FromBody] IFRS ifrs)
        {
            if (ifrs == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            await _repository.UpdateIFRS(ifrs);
            return NoContent();

        }

        [HttpDelete("{referencia}")]
        public async Task<ActionResult> DeleteIFRS(int referencia)
        {
            await _repository.DeleteIFRS(referencia);
            return NoContent();
        }

    }
}
