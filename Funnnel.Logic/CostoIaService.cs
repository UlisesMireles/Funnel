using Funnel.Data.Interfaces;
using Funnel.Models;
using Funnel.Models.Base;
using Funnnel.Logic.Interfaces;


namespace Funnnel.Logic
{
    public class CostoIaService : ICostoIaService
    {
        private readonly ICostoIaData _costoIaData;
        public CostoIaService(ICostoIaData costoIaData)
        {
            _costoIaData = costoIaData;
        }
        public async Task<List<CostoIaDto>> ObtenerReporteCosto()
        {
            return await _costoIaData.ObtenerReporteCosto();
        }
    }
}
