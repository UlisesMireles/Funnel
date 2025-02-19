using Funnel.Models;

namespace Funnel.Data.Interfaces
{
    public interface IStatsData
    {
        public Task<List<Stats>> ObtenerStats();
    }
}
