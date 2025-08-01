using Funnel.Models;
using Funnnel.Logic.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CostoIaController : Controller
    {
        private readonly ICostoIaService _costoIaService;
        public CostoIaController(ICostoIaService costoIaService)
        {
            _costoIaService = costoIaService;
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<CostoIaDto>>> ObtenerReporteCosto()
        {
            var respuesta = await _costoIaService.ObtenerReporteCosto();
            return Ok(respuesta);
        }
    }
}
