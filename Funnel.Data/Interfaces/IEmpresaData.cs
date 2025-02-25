using Funnel.Models;
using Funnel.Models.Base;

namespace Funnel.Data.Interfaces
{
    public interface IEmpresaData
    {
        public Task<BaseOut> GuardarEmpresa(GuardarEmpresaDto request);
        public Task<List<EmpresasDto>> ConsultarEmpresas();
        public Task<List<AdminsEmpresaDto>> ConsultaAdminsEmpresas();
        public Task<List<ComboLicenciasDto>> ComboLicencias();
    }
}
