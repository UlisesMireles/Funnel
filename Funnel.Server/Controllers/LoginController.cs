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

        [HttpPost("[action]/")]
        public async Task<ActionResult<UsuarioLogin>> Autenticacion(UsuarioData usr)
        {
            var respuesta = await _loginService.Autenticar(usr.Usuario, usr.Pass);
            if (respuesta.IdUsuario > 0)
                HttpContext.Session.SetString("User", usr.Usuario);
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

        [HttpPost("[action]/")]
        public async Task<ActionResult<TwoFactor>> TwoFactor(UsuarioDosPasos usuario)
        {
            var respuesta = await _loginService.TwoFactor(usuario);
            return Ok(respuesta);
        }
    }
}
