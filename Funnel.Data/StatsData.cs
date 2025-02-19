using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace Funnel.Data
{
    public class StatsData : IStatsData
    {
        private readonly string _connectionString;
        public StatsData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<List<Stats>> ObtenerStats()
        {
            List<Stats> stats = new List<Stats>();
            using (IDataReader reader = await DataBase.GetReader("F_ObtenerStats", CommandType.StoredProcedure, _connectionString))
            {
                while (reader.Read())
                {
                    var stat = new Stats();
                    stat.Empresa = ComprobarNulos.CheckStringNull(reader["Empresa"]);
                    stat.Estatus = ComprobarNulos.CheckBooleanNull(reader["Estatus"]);
                    stat.DescripcionEstatus = ComprobarNulos.CheckStringNull(reader["DesEstatus"]);
                    stat.UsuariosActivos = ComprobarNulos.CheckIntNull(reader["UsuariosActivos"]);
                    stat.UsuariosRegistrados = ComprobarNulos.CheckIntNull(reader["UsuariosRegistrados"]);
                    stat.OportunidadesActivas = ComprobarNulos.CheckIntNull(reader["OportunidadesActivas"]);
                    stat.OportunidadesRegistradas = ComprobarNulos.CheckIntNull(reader["OportunidadesRegistradas"]);
                    stats.Add(stat);
                }
            }
            return stats;
        }
    }
}
