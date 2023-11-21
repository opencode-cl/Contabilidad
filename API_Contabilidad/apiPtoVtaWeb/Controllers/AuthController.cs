using apiPtoVtaWeb.Model;
using Microsoft.AspNetCore.Mvc;
using apiPtoVtaWeb.Data.Services.Interfaces;
using apiPtoVtaWeb.Services.Interfaces;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using apiPtoVtaWeb.Data.Helpers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    public AuthController(IAuthenticationUserService authenticationService, ITenantRegistry tenantRegistry)
    {
        AuthenticationService = authenticationService;
        TenantRegistry = tenantRegistry;
    }

    public readonly IAuthenticationUserService AuthenticationService;
    public readonly ITenantRegistry TenantRegistry;
    

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthLogin model)
    {
        // Validate the model
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Authenticate the user
        var user = await AuthenticationService.LoginMasterUser(model);

        if (user == null)
        {
            return Unauthorized("Invalid username or password");
        }

        var tokenString = TokenJwtHelper.GenerateToken(user);
        
        return Ok(tokenString);
    }

    // [HttpGet("tenats")]
    // public async Task<IActionResult> getTenats()
    // {
    //     return Ok(TenantRegistry.GetTenants().ToList()); // You can return a token or other relevant data here
    // }
}