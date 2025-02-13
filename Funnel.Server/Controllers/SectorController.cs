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
        public async Task<ActionResult<BaseOut>> INS_UPD_Sector(INS_UPD_Sector request)
        {
            var respuesta = await _sectorService.INS_UPD_Sector(request);
            return Ok(respuesta);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<SEL_Sectores>>> SEL_Sectores()
        {
            var respuesta = await _sectorService.SEL_Sectores();
            return Ok(respuesta);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<SEL_Sectores_CMB>>> SEL_Sectores_CMB()
        {
            var respuesta = await _sectorService.SEL_Sectores_CMB();
            return Ok(respuesta);
        }
    }
}
