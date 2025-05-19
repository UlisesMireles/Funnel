using Funnel.Models;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Http;

namespace Funnnel.Logic.Interfaces
{
    public interface IEmpresaService
    {
        public Task<BaseOut> GuardarEmpresa(GuardarEmpresaDto request);
        public Task<List<EmpresasDto>> ConsultarEmpresas();
        public Task<List<AdminsEmpresaDto>> ConsultaAdminsEmpresas();
        public Task<List<ComboLicenciasDto>> ComboLicencias();
        public Task<BaseOut> GuardarImagenEmpresa(List<IFormFile> imagen, GuardarEmpresaDto request);
    }
}
