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
    public class LineasController : ControllerBase
    {
        private readonly ILineasRepository _repository;

        public LineasController(ILineasRepository repository)
        {
            _repository = repository;
        }

        //[HttpGet]
        //public async Task<IActionResult> GetAllLineas()
        //{
          //  var lineas = await _repository.GetAllLineas();
            //return Ok(lineas);
        //}

        [HttpGet("{referencia}")]
        public async Task<IActionResult> GetLinea(int referencia)
        {
            var linea = await _repository.GetLineaDetails(referencia);
            if (linea == null)
            {
                return NotFound();
            }

            return Ok(linea);
        }


        [HttpPost]
        public async Task<IActionResult> CreateLinea([FromBody] Linea linea)
        {
            if (linea == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _repository.InsertLinea(linea);
            return CreatedAtAction(nameof(GetLinea), new { referencia = linea.Referencia }, created);
        }

        [HttpPut("{referencia}")]
        public async Task<IActionResult> UpdateLinea(int referencia, [FromBody] Linea linea)
        {
            if (linea == null || referencia != linea.Referencia)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingLinea = await _repository.GetLineaDetails(referencia);
            if (existingLinea == null)
            {
                return NotFound();
            }

            await _repository.UpdateLinea(linea);
            return NoContent();
        }

        [HttpDelete("{referencia}")]
        public async Task<IActionResult> DeleteLinea(int referencia)
        {
            var existingLinea = await _repository.GetLineaDetails(referencia);
            if (existingLinea == null)
            {
                return NotFound();
            }

            await _repository.DeleteLinea(referencia);
            return NoContent();
        }
    }
}