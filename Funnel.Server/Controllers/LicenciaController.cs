using Funnel.Models;
using Funnel.Models.Base;
using Funnnel.Logic.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LicenciaController: Controller
    {
        private readonly ILicenciaService _licenciaService;
        public  LicenciaController (ILicenciaService licenciaService)
        {
            _licenciaService = licenciaService;
        }
        [HttpPost("[action]/")]
        public async Task<ActionResult<BaseOut>> INS_UPD_Licencia(INS_UPD_Licencia request)
        {
            var respuesta = await _licenciaService.INS_UPD_Licencia(request);
            return Ok(respuesta);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<SEL_Licencias>>> SEL_Licencias()
        {
            var respuesta = await _licenciaService.SEL_Licencias();
            return Ok(respuesta);
        }
    }
}
