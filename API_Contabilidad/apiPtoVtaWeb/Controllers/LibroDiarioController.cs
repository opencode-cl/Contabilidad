using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using apiPtoVtaWeb.Model.Forms;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LibroDiarioController : ControllerBase
    {
        private readonly ILibroDiarioRepository _repository;

        public LibroDiarioController(ILibroDiarioRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("excel")]
        public async Task<IActionResult> GetLibroDiario([FromQuery] RangoFechasForm form)
        {
            var excelFile = await _repository.LibroDiario(form.Empresa, form.Periodo, form.Fechai, form.Fechaf, false);

            // Define the file name for the response
            string fileName = "LibroDiario.xlsx";

            // Return the Excel file as part of the HTTP response
            return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }

        [HttpGet("resumido/excel")]
        public async Task<IActionResult> GetLibroDiarioResumido([FromQuery] RangoFechasForm form)
        {
            var excelFile = await _repository.LibroDiario(form.Empresa, form.Periodo, form.Fechai, form.Fechaf, true);
    
            string fileName = "LibroDiarioResumido.xlsx";
            return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }

        [HttpGet]
        public async Task<IActionResult> GetLibroDiarioData([FromQuery] RangoFechasForm form)
        {
            return Ok(await _repository.LibroDiarioData(form.Empresa, form.Periodo, form.Fechai, form.Fechaf));
        }
    }
}