using Funnel.Models;
using Funnnel.Logic.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatsController : Controller
    {
        private readonly IStatsService _statsService;
        public StatsController(IStatsService statsService)
        {
            _statsService = statsService;
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<Stats>>> ObtenerStats()
        {
            var respuesta = await _statsService.ObtenerStats();
            return Ok(respuesta);
        }
    }
}
