using API_Contabilidad.Model;
using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoliosController : ControllerBase
    {
        private readonly IFoliosRepository _repository;

        public FoliosController(IFoliosRepository repository)
        {
            _repository = repository;
        }

       // [HttpGet]
       // public async Task<IActionResult> GetAllFolios()
       // {
         //   var folios = await _repository.GetAllFolios();
//            return Ok(folios);
        //}

        [HttpGet("{referencia}")]
        public async Task<IActionResult> GetFolio(int referencia)
        {
            var folio = await _repository.GetFolioDetails(referencia);
            if (folio == null)
            {
                return NotFound();
            }

            return Ok(folio);
        }

        [HttpGet("periodo")]
        public async Task<IActionResult> GetFolioPeriodo(int empresa, int periodo, int mes, string tipo)
        {
            var folio = await _repository.GetFoliosPeriodo(empresa, periodo, mes, tipo);
            if (folio == null)
            {
                return NotFound();
            }

            return Ok(folio);
        }

        [HttpGet("lineas")]
        public async Task<IActionResult> GetFolioLineas(int empresa, int periodo, int mes, string tipo, int cuenta)
        {
            var folio = await _repository.GetLineas(empresa, periodo, mes, tipo, cuenta);
            if (folio == null)
            {
                return NotFound();
            }

            return Ok(folio);
        }

        [HttpPost]
        public async Task<IActionResult> CreateFolio([FromBody] Folio folio)
        {
            if (folio == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _repository.InsertFolio(folio);
            return CreatedAtAction(nameof(GetFolio), new { referencia = folio.Referencia }, created);
        }

        [HttpPut("{referencia}")]
        public async Task<IActionResult> UpdateFolio(int referencia, [FromBody] Folio folio)
        {
            if (folio == null || referencia != folio.Referencia)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingFolio = await _repository.GetFolioDetails(referencia);
            if (existingFolio == null)
            {
                return NotFound();
            }

            await _repository.UpdateFolio(folio);
            return NoContent();
        }

        [HttpDelete("{referencia}")]
        public async Task<IActionResult> DeleteFolio(int referencia)
        {
            var existingFolio = await _repository.GetFolioDetails(referencia);
            if (existingFolio == null)
            {
                return NotFound();
            }

            await _repository.DeleteFolio(referencia);
            return NoContent();
        }

        [HttpPost("completo")]
        public async Task<IActionResult> InsertFolioCompleto([FromBody] FolioCompleto folio)
        {
            if (folio == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _repository.InsertFolioCompleto(folio);
            return CreatedAtAction(nameof(GetFolio), new { referencia = folio.folio.Referencia }, created);
        }
    }
}