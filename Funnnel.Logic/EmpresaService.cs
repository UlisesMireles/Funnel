using Funnel.Data;
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
        public async Task<BaseOut> INS_UPD_Empresa(INS_UPD_Empresa request)
        {
            return await _EmpresaData.INS_UPD_Empresa(request);
        }
        public async Task<List<SEL_Empresas>> SEL_Empresas()
        {
            return await _EmpresaData.SEL_Empresas();
        }
        public async Task<List<SEL_Admins>> SEL_Admins()
        {
            return await _EmpresaData.SEL_Admins();
        }
        public async Task<List<SEL_Licencias>> SEL_Licencias()
        {
            return await _EmpresaData.SEL_Licencias();
        }
    }
}
