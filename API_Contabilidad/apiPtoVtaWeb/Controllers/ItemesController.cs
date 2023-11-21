using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemesController : ControllerBase
    {
        private readonly IItemesRepository _repository;
        public ItemesController(IItemesRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetItemes()
        {
            return Ok(await _repository.GetItemes());
        }

        [HttpGet("empresa/{empresa}")]
        public async Task<IActionResult> GetItemesEmpresa(int empresa)
        {
            return Ok(await _repository.GetItemesEmpresa(empresa));
        }

        [HttpGet("{referencia}")]
        public async Task<IActionResult> GetItemDetails(int referencia)
        {
            return Ok(await _repository.GetItemDetails(referencia));
        }

        [HttpPost]
        public async Task<IActionResult> InsertItemes([FromBody] Itemes item)
        {

            if (item == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var created = await _repository.InsertItemes(item);
            return Created("created", created);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateItemes([FromBody] Itemes itemes)
        {
            if (itemes == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            await _repository.UpdateItemes(itemes);
            return NoContent();

        }

        [HttpDelete("{referencia}")]
        public async Task<ActionResult> DeleteNombre(int referencia)
        {
            await _repository.DeleteItem(referencia);
            return NoContent();
        }

        //  ----------- ITEMES MAESTROS ----------------

        [HttpGet("maestros/empresa/{empresa}")]
        public async Task<IActionResult> GetItemesMaestros(int empresa)
        {
            return Ok(await _repository.GetItemesMaestroEmpresa(empresa));
        }

        [HttpGet("maestros/{referencia}")]
        public async Task<IActionResult> GetItemMaestroDetails(int referencia)
        {
            return Ok(await _repository.GetItemMaestroDetails(referencia));
        }

        [HttpPost("maestros/")]
        public async Task<IActionResult> InsertItemMaestro([FromBody] ItemesMaestro item)
        {

            if (item == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var created = await _repository.InsertItemesMaestro(item);
            return Created("created", created);

        }

        [HttpPut("maestros/")]
        public async Task<IActionResult> UpdateItemMaestro([FromBody] ItemesMaestro itemes)
        {
            if (itemes == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            await _repository.UpdateItemesMaestro(itemes);
            return NoContent();

        }

        [HttpDelete("maestros/{referencia}")]
        public async Task<ActionResult> Deletee(int referencia)
        {
            await _repository.DeleteItemesMaestro(referencia);
            return NoContent();
        }

        // -------------- Itemes Cuentas ---------------

        [HttpGet("{item}/cuentas")]
        public async Task<IActionResult> GetItemesCuentas(int item)
        {
            return Ok(await _repository.GetItemesCuenta(item));
        }

        [HttpGet("cuentas/{referencia}")]
        public async Task<IActionResult> GetItemCuentaDetails(int referencia)
        {
            return Ok(await _repository.GetItemCuentaDetails(referencia));
        }

        [HttpPost("cuentas/")]
        public async Task<IActionResult> InsertItemCuenta([FromBody] ItemesCuentas item)
        {

            if (item == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var created = await _repository.InsertItemesCuenta(item);
            return Created("created", created);

        }

        [HttpDelete("cuentas/{referencia}")]
        public async Task<ActionResult> DeleteItemCuenta(int referencia)
        {
            await _repository.DeleteItemesCuenta(referencia);
            return NoContent();
        }
    }
}
