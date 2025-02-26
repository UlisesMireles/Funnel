using Funnel.Models;
using Funnel.Models.Base;
using Funnnel.Logic;
using Funnnel.Logic.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SectorController:Controller
    {
        private readonly ISectorService _sectorService;
        public SectorController(ISectorService sectorService)
        {
            _sectorService = sectorService;
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult<BaseOut>> GuardarSector(GuardarSectorDto request)
        {
            var respuesta = await _sectorService.GuardarSector(request);
            return Ok(respuesta);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<SectoresDto>>> ConsultarSectores()
        {
            var respuesta = await _sectorService.ConsultarSectores();
            return Ok(respuesta);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<ComboSectoresDto>>> ComboSectores()
        {
            var respuesta = await _sectorService.ComboSectores();
            return Ok(respuesta);
        }
    }
}
