using Funnel.Data.Interfaces;
using Funnel.Models;
using Funnnel.Logic.Interfaces;

namespace Funnnel.Logic
{
    public class StatsService : IStatsService
    {
        private readonly IStatsData _statsData;
        public StatsService(IStatsData statsData) 
        {
            _statsData = statsData;
        }
        public async Task<List<Stats>> ObtenerStats()
        {
            return await _statsData.ObtenerStats();
        }
    }
}
