using Funnel.Models;
using Funnnel.Logic;
using Funnnel.Logic.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly ILoginService _loginService;
        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<Prueba>>> Prueba()
        {
            var respuesta = await _loginService.Prueba();
            return Ok(respuesta);
        }
    }
}
