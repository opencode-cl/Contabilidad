using apiPtoVtaWeb.Data.Repositories.Interface;
using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SucursalesController : ControllerBase
    {
        private readonly ISucursalesRepository _repository;
        public SucursalesController(ISucursalesRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSucursales()
        {
            return Ok(await _repository.GetAllSucursales());
        }

        [HttpGet("empresa/{empresa}")]
        public async Task<IActionResult> GetSucursalesEmpresa(int empresa)
        {
            return Ok(await _repository.GetAllSucursalesEmpresa(empresa));
        }

        [HttpGet("{referencia}")]
        public async Task<IActionResult> GetObra(int referencia)
        {
            return Ok(await _repository.GetSucursalDetails(referencia));
        }

        [HttpPost]
        public async Task<IActionResult> CreateObra([FromBody] Sucursal sucursal)
        {

            if (sucursal == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var created = await _repository.InsertSucursal(sucursal);
            return Created("created", created);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateGlosa([FromBody] Sucursal sucursal)
        {
            if (sucursal == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            await _repository.UpdateSucursal(sucursal);
            return NoContent();

        }

        [HttpDelete("{referencia}")]
        public async Task<ActionResult> DeleteGrupo(int referencia)
        {
            await _repository.DeleteSucursal(referencia);
            return NoContent();
        }

    }
}
