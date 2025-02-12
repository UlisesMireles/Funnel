using Funnel.Models;
using Funnel.Models.Base;
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
        public async Task<ActionResult<List<Administrador>>> CatalogoAdministradores()
        {
            var respuesta = await _adminService.CatalogoAdministradores();
            return Ok(respuesta);
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<Administrador>> ObtenerAdministradorPorUsuario(string usuario)
        {
            var respuesta = await _adminService.ObtenerAdministradorPorUsuario(usuario);
            return Ok(respuesta);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult<BaseOut>> InsertaAdministradores(Administrador admin)
        {
            var respuesta = await _adminService.InsertaAdministrador(admin);
            return Ok(respuesta);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult<BaseOut>> ModificaAdministradores(Administrador admin)
        {
            var respuesta = await _adminService.ModificaAdministrador(admin);
            return Ok(respuesta);
        }
    }
}
