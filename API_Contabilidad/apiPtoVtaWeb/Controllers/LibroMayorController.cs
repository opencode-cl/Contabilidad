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
    public class LibroMayorController : ControllerBase
    {
        private readonly ILibroMayorRepository _repository;

        public LibroMayorController(ILibroMayorRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("excel")]
        public async Task<IActionResult> GetLibroMayor([FromQuery] LibroMayorForm form)
        {
            var excelFile = await _repository.LibroMayor(form.Empresa, form.Periodo, form.CuentaInicio, form.CuentaFinal, form.FechaInicio, form.FechaFinal, form.IFRS);

            string fileName = "LibroMayor.xlsx";
            return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }

        [HttpGet]
        public async Task<IActionResult> GetLibroMayorData([FromQuery] LibroMayorForm form)
        {
            return Ok(await _repository.LibroMayorData(form.Empresa, form.Periodo, form.CuentaInicio, form.CuentaFinal, form.FechaInicio, form.FechaFinal, form.IFRS));
        }
    }
}