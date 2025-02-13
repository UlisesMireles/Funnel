using Funnel.Models;
using Funnel.Models.Base;

namespace Funnnel.Logic.Interfaces
{
    public interface IEmpresaService
    {
        public Task<BaseOut> INS_UPD_Empresa(INS_UPD_Empresa request);
        public Task<List<SEL_Empresas>> SEL_Empresas();
        public Task<List<SEL_Admins>> SEL_Admins();
        public Task<List<Catalog_Licencias>> Catalog_Licencias();
    }
}
