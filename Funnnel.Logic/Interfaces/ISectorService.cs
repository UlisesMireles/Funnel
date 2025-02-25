using Funnel.Models;
using Funnel.Models.Base;

namespace Funnnel.Logic.Interfaces
{
    public interface ISectorService
    {
        public Task<BaseOut> GuardarSector(GuardarSectorDto request);
        public Task<List<SectoresDto>> ConsultarSectores();
        public Task<List<ComboSectoresDto>> ComboSectores();
    }
}
