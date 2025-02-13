using Funnel.Models;
using Funnel.Models.Base;

namespace Funnel.Data.Interfaces
{
    public interface ILicenciaData
    {
        public Task<List<SEL_Licencias>> SEL_Licencias();
        public Task<BaseOut> INS_UPD_Licencia(INS_UPD_Licencia request);
    }
}
