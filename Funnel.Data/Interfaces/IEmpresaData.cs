using Funnel.Models;
using Funnel.Models.Base;

namespace Funnel.Data.Interfaces
{
    public interface IEmpresaData
    {
        public Task<BaseOut> INS_UPD_Empresa(INS_UPD_Empresa request);
        public Task<List<SEL_Empresas>> SEL_Empresas();
        public Task<List<SEL_Admins>> SEL_Admins();
        public Task<List<SEL_Licencias>> SEL_Licencias();
    }
}
