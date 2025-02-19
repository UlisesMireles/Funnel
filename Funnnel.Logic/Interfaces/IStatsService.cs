using Funnel.Models;

namespace Funnnel.Logic.Interfaces
{
    public interface IStatsService
    {
        public Task<List<Stats>> ObtenerStats();
    }
}
