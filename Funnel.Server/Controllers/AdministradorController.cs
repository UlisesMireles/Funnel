using Funnel.Models;
using Funnnel.Logic.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdministradorController : Controller
    {
        private readonly IAdministracionService _adminService;
        public AdministradorController(IAdministracionService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<UsuarioLogin>> CatalogoAdministradores()
        {
            var respuesta = await _adminService.CatalogoAdministradores();
            return Ok(respuesta);
        }
    }
}
