using apiPtoVtaWeb.Data.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace apiPtoVtaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuariosRepository _repository;

        public UsuariosController(IUsuariosRepository repository)
        {
            _repository = repository;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] UserLogin usuario)
        {
            if (usuario == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var loginResult = await _repository.LoginUser(usuario);

            if (loginResult)
            {
                return (Ok(loginResult));
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetUsuarios()
        {
            return Ok(await _repository.GetUsuarios());
        }

        [HttpPost]
        public async Task<IActionResult> CreateGrupo([FromBody] Usuario usuario)
        {

            if (usuario == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var created = await _repository.InsertUsuario(usuario);
            return Created("created", created);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateGlosa([FromBody] Usuario usuario)
        {
            if (usuario == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            await _repository.UpdateUsuario(usuario);
            return NoContent();

        }

        [HttpDelete("{referencia}")]
        public async Task<ActionResult> DeleteGrupo(int referencia)
        {
            await _repository.DeleteUsuario(referencia);
            return NoContent();
        }

        [HttpGet("empresas/{codigo}")]
        public async Task<IActionResult> GetEmpresas(string codigo)
        {
            return Ok(await _repository.GetEmpresas(codigo));
        }
        [HttpGet("lastRegistro/{usuario}")]
        public async Task<IActionResult> GetLastRegistro(string usuario)
        {
            return Ok(await _repository.GetLastRegistro(usuario));
        }

        [HttpPost("empresas")]
        public async Task<IActionResult> InsertEmpresa([FromBody] UsuariosEmpresas usuariod)
        {

            if (usuariod == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var created = await _repository.AddEmpresa(usuariod);
            return Created("created", created);

        }
        [HttpPost("addRegistro")]
        public async Task<IActionResult> AddRegistro([FromBody] Registro registro)
        {

            if (registro == null)
            {
                
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }

            var created = await _repository.AddRegistro(registro);
            return Created("addRegistro", created);

        }

        [HttpDelete("empresas/{referencia}")]
        public async Task<ActionResult> DeleteEmpresa(int referencia)
        {
            await _repository.DeleteEmpresa(referencia);
            return NoContent();
        }


    }
}
