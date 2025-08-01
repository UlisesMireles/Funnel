using Funnel.Models;
using Funnel.Models.Base;

namespace Funnel.Data.Interfaces
{
    public interface ICostoIaData
    {
        public Task<List<CostoIaDto>> ObtenerReporteCosto();
    }
}
