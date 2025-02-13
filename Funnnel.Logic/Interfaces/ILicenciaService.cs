using Funnel.Models;
using Funnel.Models.Base;

namespace Funnnel.Logic.Interfaces
{
    public interface ILicenciaService
    {
        public Task<BaseOut> INS_UPD_Licencia(INS_UPD_Licencia request);
        public Task<List<SEL_Licencias>> SEL_Licencias();
    }
}
