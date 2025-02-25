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
        public async Task<BaseOut> GuardarSector(GuardarSectorDto request)
        {
            return await _SectorData.GuardarSector(request);
        }
        public async Task<List<SectoresDto>> ConsultarSectores()
        {
            return await _SectorData.ConsultarSectores();
        }
        public async Task<List<ComboSectoresDto>> ComboSectores()
        {
            return await _SectorData.ComboSectores();
        }
    }
}
