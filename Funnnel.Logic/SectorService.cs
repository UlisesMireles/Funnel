using Funnel.Data.Interfaces;
using Funnel.Models;
using Funnel.Models.Base;
using Funnnel.Logic.Interfaces;


namespace Funnnel.Logic
{
    public class SectorService : ISectorService
    {
        private readonly ISectorData _SectorData;
        public SectorService(ISectorData SectorData)
        {
            _SectorData = SectorData;
        }
        public async Task<BaseOut> INS_UPD_Sector(INS_UPD_Sector request)
        {
            return await _SectorData.INS_UPD_Sector(request);
        }
        public async Task<List<SEL_Sectores>> SEL_Sectores()
        {
            return await _SectorData.SEL_Sectores();
        }
        public async Task<List<SEL_Sectores_CMB>> SEL_Sectores_CMB()
        {
            return await _SectorData.SEL_Sectores_CMB();
        }
    }
}
