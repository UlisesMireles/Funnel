using Funnel.Models;
using Funnel.Models.Base;

namespace Funnel.Data.Interfaces
{
    public interface ISectorData
    {
        public Task<BaseOut> GuardarSector (GuardarSectorDto request);
        public Task<List<SectoresDto>> ConsultarSectores();
        public Task<List<ComboSectoresDto>> ComboSectores();
    }
}
