using System.Data;
using Funnel.Models;
using Microsoft.Extensions.Configuration;
using Funnel.Data.Utils;
using Funnel.Data.Interfaces;
using Funnel.Models.Base;

namespace Funnel.Data
{
    public class SectorData : ISectorData
    {
        private readonly string _connectionString;
        public SectorData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }
        public async Task<BaseOut> GuardarSector(GuardarSectorDto request)
        {
            BaseOut result = new BaseOut();

            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Bandera ?? (object)DBNull.Value ),
                    DataBase.CreateParameterSql("@pIdSector", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdSector),
                    DataBase.CreateParameterSql("@pNombreSector", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.NombreSector ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@pDescripcionSector", SqlDbType.VarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, request.DescripcionSector ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@pIdUsuarioCreador", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdUsuarioCreador),
                    DataBase.CreateParameterSql("@pActivo", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Activo),
                };

                // Ejecutar el SP sin leer datos
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoSectores", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {

                    }
                }
                switch (request.Bandera)
                {
                    case "UPD-SECTOR":
                        result.ErrorMessage = "El sector se actualizó correctamente.";
                        result.Id = 1;
                        result.Result = true;
                        break;
                    case "INS-SECTOR":
                        result.ErrorMessage = "El sector se insertó correctamente.";
                        result.Id = 1;
                        result.Result = true;
                        break;
                }

            }
            catch (Exception ex)
            {
                switch (request.Bandera)
                {
                    case "UPD-SECTOR":
                        result.ErrorMessage = "Error al actualizar el sector: " + ex.Message;
                        result.Id = 0;
                        result.Result = false;
                        break;
                    case "INS-SECTOR":
                        result.ErrorMessage = "Error al insertar sector: " + ex.Message;
                        result.Id = 0;
                        result.Result = false;
                        break;
                }

            }

            return result;
        }
        public async Task<List<SectoresDto>> ConsultarSectores()
        {
            List<SectoresDto> result = new List<SectoresDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>{
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-SECTORES")
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoSectores", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new SectoresDto();
                    dto.IdSector = ComprobarNulos.CheckIntNull(reader["IdSector"]);
                    dto.NombreSector = ComprobarNulos.CheckStringNull(reader["NombreSector"]);
                    dto.DescripcionSector = ComprobarNulos.CheckStringNull(reader["DescripcionSector"]);
                    dto.FechaCreacion = ComprobarNulos.CheckStringNull(reader["FechaCreacion"]);
                    dto.UsuarioCreador = ComprobarNulos.CheckStringNull(reader["UsuarioCreador"]);
                    dto.FechaModificacion = ComprobarNulos.CheckStringNull(reader["FechaModificacion"]);
                    dto.UsuarioModifico = ComprobarNulos.CheckStringNull(reader["UsuarioModifico"]);
                    dto.DesEstatusActivo = ComprobarNulos.CheckStringNull(reader["DesEstatusActivo"]);
                    result.Add(dto);
                }
            }
            return result;
        }
        public async Task<List<ComboSectoresDto>> ComboSectores()
        {
            List<ComboSectoresDto> result = new List<ComboSectoresDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>{
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-SECTORES-CMB")
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoSectores", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ComboSectoresDto();
                    dto.IdSector = ComprobarNulos.CheckIntNull(reader["IdSector"]);
                    dto.NombreSector = ComprobarNulos.CheckStringNull(reader["NombreSector"]);
                    dto.DescripcionSector = ComprobarNulos.CheckStringNull(reader["DescripcionSector"]);
                    result.Add(dto);
                }
            }
            return result;
        }
    }
}
