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
        public async Task<ActionResult<BaseOut>> GuardarLicencia(GuardarLicenciaDto request)
        {
            var respuesta = await _licenciaService.GuardarLicencia(request);
            return Ok(respuesta);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<LicenciaDto>>> ConsultarLicencias()
        {
            var respuesta = await _licenciaService.ConsultarLicencias();
            return Ok(respuesta);
        }
    }
}
