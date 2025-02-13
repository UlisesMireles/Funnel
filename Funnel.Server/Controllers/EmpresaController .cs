using Funnel.Models;
using Funnel.Models.Base;
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
        public async Task<ActionResult<BaseOut>> INS_UPD_Empresa(INS_UPD_Empresa request)
        {
            var respuesta = await _empresaService.INS_UPD_Empresa(request);
            return Ok(respuesta);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<SEL_Empresas>>> SEL_Empresas()
        {
            var respuesta = await _empresaService.SEL_Empresas();
            return Ok(respuesta);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<SEL_Admins>>> SEL_Admins()
        {
            var respuesta = await _empresaService.SEL_Admins();
            return Ok(respuesta);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<Catalog_Licencias>>> Catalog_Licencias()
        {
            var respuesta = await _empresaService.Catalog_Licencias();
            return Ok(respuesta);
        }
    }
}
