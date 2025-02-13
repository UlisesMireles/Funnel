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
        public async Task<BaseOut> INS_UPD_Sector(INS_UPD_Sector request)
        {
            BaseOut result = new BaseOut();

            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.bandera ),
                    DataBase.CreateParameterSql("@pIdSector", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.idSector),
                    DataBase.CreateParameterSql("@pNombreSector", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.nombreSector),
                    DataBase.CreateParameterSql("@pDescripcionSector", SqlDbType.VarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, request.descripcionSector),
                    DataBase.CreateParameterSql("@pIdUsuarioCreador", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.idUsuarioCreador),
                    DataBase.CreateParameterSql("@pActivo", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.activo),
                };

                // Ejecutar el SP sin leer datos
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoSectores", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {

                    }
                }
                switch (request.bandera)
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
                switch (request.bandera)
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
        public async Task<List<SEL_Sectores>> SEL_Sectores()
        {
            List<SEL_Sectores> result = new List<SEL_Sectores>();
            IList<ParameterSQl> list = new List<ParameterSQl>{
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-SECTORES")
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoSectores", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new SEL_Sectores();
                    dto.idSector = ComprobarNulos.CheckIntNull(reader["IdSector"]);
                    dto.nombreSector = ComprobarNulos.CheckStringNull(reader["NombreSector"]);
                    dto.descripcionSector = ComprobarNulos.CheckStringNull(reader["DescripcionSector"]);
                    dto.fechaCreacion = ComprobarNulos.CheckStringNull(reader["FechaCreacion"]);
                    dto.usuarioCreador = ComprobarNulos.CheckStringNull(reader["UsuarioCreador"]);
                    dto.fechaModificacion = ComprobarNulos.CheckStringNull(reader["FechaModificacion"]);
                    dto.usuarioModifico = ComprobarNulos.CheckStringNull(reader["UsuarioModifico"]);
                    dto.desEstatusActivo = ComprobarNulos.CheckStringNull(reader["DesEstatusActivo"]);
                    result.Add(dto);
                }
            }
            return result;
        }
        public async Task<List<SEL_Sectores_CMB>> SEL_Sectores_CMB()
        {
            List<SEL_Sectores_CMB> result = new List<SEL_Sectores_CMB>();
            IList<ParameterSQl> list = new List<ParameterSQl>{
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-SECTORES-CMB")
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoSectores", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new SEL_Sectores_CMB();
                    dto.idSector = ComprobarNulos.CheckIntNull(reader["IdSector"]);
                    dto.nombreSector = ComprobarNulos.CheckStringNull(reader["NombreSector"]);
                    dto.descripcionSector = ComprobarNulos.CheckStringNull(reader["DescripcionSector"]);
                    result.Add(dto);
                }
            }
            return result;
        }
    }
}
