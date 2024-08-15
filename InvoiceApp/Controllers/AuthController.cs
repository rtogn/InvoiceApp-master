using InvoiceApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace InvoiceApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly ILogger<AuthController> _logger;
        private readonly TokenManager _tokenService;

        public AuthController(ILogger<AuthController> logger, TokenManager tokenService)
        {
            _logger = logger;
            _tokenService = tokenService;
        }

        [HttpPost("Authenticate")]
        public IActionResult Authenticate([FromBody] User user)
        {
            try
            {
                var timer = new Stopwatch();

                //_logger.LogDebug("(LW) Authentication by {user.UserName}", user.UserName);
                timer.Start();

                // Hardcoded in place of server call
                string username_HC = "string";
                string password_HC = "string";

                if (user.UserName == username_HC && user.Password == password_HC)
                {
                    var token = _tokenService.Authenticate(user.UserName);
                    timer.Stop();
                    //_logger.LogDebug("(F) Authentication for {user} finished in {ticks} ticks", user, timer.ElapsedTicks);
                    return Ok(new { Token = token });
                };
                _logger.LogInformation("User {user.UserName} failed to authenticate", user.UserName);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                
                _logger.LogCritical(ex.ToString());
            }
            return Unauthorized();
        }
    }
}
