using System.Data;
using Funnel.Models;
using Microsoft.Extensions.Configuration;
using Funnel.Data.Utils;
using Funnel.Data.Interfaces;
using Funnel.Models.Base;

namespace Funnel.Data
{
    public class CostoIaData:  ICostoIaData
    {
        private readonly string _connectionString;
        public CostoIaData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<List<CostoIaDto>> ObtenerReporteCosto()
        {
            List<CostoIaDto> result = new List<CostoIaDto>();
            using (IDataReader reader = await DataBase.GetReader("F_Tenant_ObtenerEstadisticasUsoIA", CommandType.StoredProcedure, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new CostoIaDto();
                    dto.IdEmpresa = ComprobarNulos.CheckIntNull(reader["IdEmpresa"]);
                    dto.NombreEmpresa = ComprobarNulos.CheckStringNull(reader["NombreEmpresa"]);
                    dto.CostoTotalL= ComprobarNulos.CheckDecimalNull(reader["CostoTotalL"]);
                    dto.TokenEntrada = ComprobarNulos.CheckIntNull(reader["TokenEntrada"]);
                    dto.TokenSalida = ComprobarNulos.CheckIntNull(reader["TokenSalida"]);
                    dto.FechaPregunta = ComprobarNulos.CheckDateTimeNull(reader["FechaPregunta"]);
                    result.Add(dto);
                }
            }
            return result;
        }
    }
}
