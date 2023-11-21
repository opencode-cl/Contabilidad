using apiPtoVtaWeb.Model;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace apiPtoVtaWeb.Data.Helpers
{
    public class TokenJwtHelper
    {
        public const string ISSUER = "http://localhost::7297/";
        public const string AUDIENCE = "http://localhost::7297/";
        public const string SECURITY_KEY = "tokenSecurityKeasdfdsafdsafasfdsfy@1";

        public static TokenValidationParameters GetTokenParameters()
        {
            return new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = ISSUER,
                ValidAudience = AUDIENCE,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SECURITY_KEY))
            };
        }

        public static string GenerateToken(Authentication user)
        {
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SECURITY_KEY));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var tokenOptions = new JwtSecurityToken(
                issuer: ISSUER,
                audience: AUDIENCE,
                claims: new List<Claim>() { new(ClaimConstants.TenantId, user.Nombre ?? string.Empty) },
                expires: DateTime.Now.AddMinutes(10000),
                signingCredentials: signinCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }

    }
}
