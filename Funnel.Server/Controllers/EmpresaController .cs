using Funnel.Models;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Funnnel.Logic.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpresaController : Controller
    {
        private readonly IEmpresaService _empresaService;
        public EmpresaController(IEmpresaService empresaService)
        {
            _empresaService = empresaService;
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult<BaseOut>> GuardarEmpresa(GuardarEmpresaDto request)
        {
            var respuesta = await _empresaService.GuardarEmpresa(request);
            return Ok(respuesta);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<EmpresasDto>>> ConsultarEmpresas()
        {
            var respuesta = await _empresaService.ConsultarEmpresas();
            return Ok(respuesta);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<AdminsEmpresaDto>>> ConsultaAdminsEmpresas()
        {
            var respuesta = await _empresaService.ConsultaAdminsEmpresas();
            return Ok(respuesta);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<ComboLicenciasDto>>> ComboLicencias()
        {
            var respuesta = await _empresaService.ComboLicencias();
            return Ok(respuesta);
        }
        [HttpPost("[action]")]
        public async Task<ActionResult<GuardarEmpresaDto>> GuardarImagenEmpresa([FromForm] List<IFormFile> imagen, [FromForm] GuardarEmpresaDto request)
        {
            var result = await _empresaService.GuardarImagenEmpresa(imagen, request);
            return Ok(result);
        }
    }
}

