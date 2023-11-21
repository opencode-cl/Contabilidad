using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CentroController : ControllerBase
    {
        private readonly ICentroRepository _repository;
        public CentroController(ICentroRepository repository)
        {
            _repository = repository;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllCentros()
        {
            return Ok(await _repository.GetAllCentros());
        }

        [HttpGet("{referencia}")]
        public async Task<IActionResult> GetCentro(int referencia)
        {
            return Ok(await _repository.GetCentro(referencia));
        }

    }
}
