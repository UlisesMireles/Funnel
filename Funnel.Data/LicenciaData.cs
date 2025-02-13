using System.Data;
using Funnel.Models;
using Microsoft.Extensions.Configuration;
using Funnel.Data.Utils;
using Funnel.Data.Interfaces;
using Azure.Core;
using Funnel.Models.Base;

namespace Funnel.Data
{
    public class LicenciaData: ILicenciaData
    {
        private readonly string _connectionString;
        public LicenciaData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }
        public async Task<BaseOut> INS_UPD_Licencia(INS_UPD_Licencia request)
        {
            BaseOut result=new BaseOut();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.bandera ),
                    DataBase.CreateParameterSql("@pIdLicencia", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.IdLicencia ),
                    DataBase.CreateParameterSql("@pNombreLicencia", SqlDbType.VarChar, 100, ParameterDirection.Input, false,null, DataRowVersion.Default, request.NombreLicencia ),
                    DataBase.CreateParameterSql("@pCantidadUsuarios", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.CantidadUsuarios ),
                    DataBase.CreateParameterSql("@pCantidadOportunidades", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.CantidadOportunidades ),
                    DataBase.CreateParameterSql("@pIdUsuarioCreador", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.IdUsuarioCreador)

                };

                // Ejecutar el SP sin leer datos
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoLicencias", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {

                    }
                }
                switch (request.bandera)
                {
                    case "UPD-LICENCIA":
                        result.ErrorMessage = "La licencia se actualizó correctamente.";
                        result.Id = 1;
                        result.Result = true;
                        break;
                    case "INS-LICENCIA":
                        result.ErrorMessage = "La licencia se insertó correctamente.";
                        result.Id = 1;
                        result.Result = true;
                        break;
                }

            }
            catch (Exception ex)
            {
                switch (request.bandera)
                {
                    case "UPD-LICENCIA":
                        result.ErrorMessage = "Error al actualizar licencia: " + ex.Message;
                        result.Id = 0;
                        result.Result = false;
                        break;
                    case "INS-LICENCIA":
                        result.ErrorMessage = "Error al insertar licencia: " + ex.Message;
                        result.Id = 0;
                        result.Result = false;
                        break;
                }

            }
            return result;
        }

        public async Task<List<SEL_Licencias>> SEL_Licencias()
        {
            List<SEL_Licencias> result = new List<SEL_Licencias>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-LICENCIAS"),
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoLicencias", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new SEL_Licencias();
                    dto.IdLicencia = ComprobarNulos.CheckIntNull(reader["IdLicencia"]);
                    dto.NombreLicencia = ComprobarNulos.CheckStringNull(reader["NombreLicencia"]);
                    dto.CantidadUsuarios = ComprobarNulos.CheckIntNull(reader["CantidadUsuarios"]);
                    dto.CantidadOportunidades = ComprobarNulos.CheckIntNull(reader["CantidadOportunidades"]);

                    result.Add(dto);
                }
            }
            return result;
        }
    }
}
