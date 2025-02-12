using Funnel.Models;
using Funnel.Models.Base;
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
        public async Task<ActionResult<UsuarioLogin>> Autenticacion(string usuario, string password)
        {
            var respuesta = await _loginService.Autenticar(usuario, password);
            if (respuesta.IdUsuario > 0)
                HttpContext.Session.SetString("User", usuario);
            return Ok(respuesta);
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<BaseOut>> RecuperarContrasena(string usuario)
        {
            var respuesta = await _loginService.ResetPassword(usuario);
            return Ok(respuesta);
        }

        [HttpPost("[action]/")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear(); 
            return Ok("Sesión cerrada.");
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<BaseOut>> ObtenerVersion()
        {
            var respuesta = await _loginService.ObtenerVersion();
            return Ok(respuesta);
        }
    }
}
