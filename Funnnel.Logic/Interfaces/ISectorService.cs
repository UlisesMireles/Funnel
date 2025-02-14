using Funnel.Models;
using Funnel.Models.Base;

namespace Funnnel.Logic.Interfaces
{
    public interface ISectorService
    {
        public Task<BaseOut> INS_UPD_Sector(INS_UPD_Sector request);
        public Task<List<SEL_Sectores>> SEL_Sectores();
        public Task<List<SEL_Sectores_CMB>> SEL_Sectores_CMB();
    }
}
