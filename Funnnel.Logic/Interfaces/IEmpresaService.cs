using Funnel.Models;
using Funnel.Models.Base;

namespace Funnnel.Logic.Interfaces
{
    public interface IEmpresaService
    {
        public Task<BaseOut> GuardarEmpresa(GuardarEmpresaDto request);
        public Task<List<EmpresasDto>> ConsultarEmpresas();
        public Task<List<AdminsEmpresaDto>> ConsultaAdminsEmpresas();
        public Task<List<ComboLicenciasDto>> ComboLicencias();
    }
}
