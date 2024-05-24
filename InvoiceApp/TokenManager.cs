using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace InvoiceApp
{
    public class TokenManager
    {
        private readonly string _secretKey;

        public TokenManager(IConfiguration configuration)
        {
            _secretKey = configuration["SecretKey"];
            if (string.IsNullOrEmpty(_secretKey) )
            {
                throw new ArgumentNullException("Secret Key not coinfiugured. Set one " +
                    "up by adding one to the User Secrets of the project" +
                    "not reccomended for a real app :)");
            }
        }
        public string Authenticate(string username)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var keyBytes = Encoding.UTF8.GetBytes(_secretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, username),
   
                }),
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(keyBytes), 
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
