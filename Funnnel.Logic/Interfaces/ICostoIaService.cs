using Funnel.Models;
using Funnel.Models.Base;

namespace Funnnel.Logic.Interfaces
{
    public interface ICostoIaService
    {
        public Task<List<CostoIaDto>> ObtenerReporteCosto();
    }
}
