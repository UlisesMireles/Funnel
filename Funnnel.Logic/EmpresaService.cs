using Funnel.Data.Interfaces;
using Funnel.Models;
using Funnel.Models.Base;
using Funnnel.Logic.Interfaces;

namespace Funnnel.Logic
{
    public class EmpresaService : IEmpresaService
    {
        private readonly IEmpresaData _EmpresaData;
        public EmpresaService(IEmpresaData EmpresaData)
        {
            _EmpresaData = EmpresaData;
        }
        public async Task<BaseOut> GuardarEmpresa(GuardarEmpresaDto request)
        {
            return await _EmpresaData.GuardarEmpresa(request);
        }
        public async Task<List<EmpresasDto>> ConsultarEmpresas()
        {
            return await _EmpresaData.ConsultarEmpresas();
        }
        public async Task<List<AdminsEmpresaDto>> ConsultaAdminsEmpresas()
        {
            return await _EmpresaData.ConsultaAdminsEmpresas();
        }
        public async Task<List<ComboLicenciasDto>> ComboLicencias()
        {
            return await _EmpresaData.ComboLicencias();
        }
    }
}
