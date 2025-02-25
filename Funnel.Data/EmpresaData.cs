using System.Data;
using Funnel.Models;
using Microsoft.Extensions.Configuration;
using Funnel.Data.Utils;
using Funnel.Data.Interfaces;
using Funnel.Models.Base;

namespace Funnel.Data
{
    public class EmpresaData : IEmpresaData
    {
        private readonly string _connectionString;
        public EmpresaData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<BaseOut> GuardarEmpresa(GuardarEmpresaDto request)
        {
            BaseOut result = new BaseOut();

            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Bandera ?? (object)DBNull.Value ),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.IdEmpresa ),
                    DataBase.CreateParameterSql("@pNombreEmpresa", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.NombreEmpresa ?? (object)DBNull.Value ),
                    DataBase.CreateParameterSql("@pIdAdministrador", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdAdministrador),
                    DataBase.CreateParameterSql("@pIdLicencia", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdLicencia),
                    DataBase.CreateParameterSql("@pAlias", SqlDbType.VarChar, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Alias ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@pRFC", SqlDbType.VarChar, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Rfc ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@pVInicio", SqlDbType.DateTime, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.VInicio),
                    DataBase.CreateParameterSql("@pVTerminacion", SqlDbType.DateTime, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.VTerminacion),
                    DataBase.CreateParameterSql("@pUsuarioCreador", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.UsuarioCreador),
                    DataBase.CreateParameterSql("@pNombre", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Nombre ?? (object)DBNull.Value ),
                    DataBase.CreateParameterSql("@pApellidoPaterno", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.ApellidoPaterno ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@pApellidoMaterno", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.ApellidoMaterno ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@pIniciales", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Iniciales ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@pCorreo", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Correo ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@pUsuario", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Usuario ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@pUrlSitio", SqlDbType.VarChar, 500, ParameterDirection.Input, false, null, DataRowVersion.Default, request.UrlSitio ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@pActivo", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.activo)
                };

                // Ejecutar el SP sin leer datos
                using (IDataReader reader = await DataBase.GetReaderSql("F_Tenant", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {

                    }
                }
                switch (request.Bandera)
                {
                    case "UPD-EMPRESA":
                        result.ErrorMessage = "La empresa se actualizó correctamente.";
                        result.Id = 1;
                        result.Result = true;
                        break;
                    case "INS-EMPRESA":
                        result.ErrorMessage = "La empresa se insertó correctamente.";
                        result.Id = 1;
                        result.Result = true;
                        break;
                }

            }
            catch (Exception ex)
            {
                switch (request.Bandera)
                {
                    case "UPD-EMPRESA":
                        result.ErrorMessage = "Error al actualizar empresa: " + ex.Message;
                        result.Id = 0;
                        result.Result = false;
                        break;
                    case "INS-EMPRESA":
                        result.ErrorMessage = "Error al insertar empresa: " + ex.Message;
                        result.Id = 0;
                        result.Result = false;
                        break;
                }

            }

            return result;
        }

        public async Task<List<EmpresasDto>> ConsultarEmpresas()
        {
            List<EmpresasDto> result = new List<EmpresasDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-EMPRESAS"),
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_Tenant", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new EmpresasDto();
                    dto.IdEmpresa = ComprobarNulos.CheckIntNull(reader["IdEmpresa"]);
                    dto.NombreEmpresa = ComprobarNulos.CheckStringNull(reader["NombreEmpresa"]);
                    dto.Alias = ComprobarNulos.CheckStringNull(reader["Alias"]);
                    dto.Rfc = ComprobarNulos.CheckStringNull(reader["RFC"]);
                    dto.VInicio = ComprobarNulos.CheckDateTimeNull(reader["VInicio"]);
                    dto.VTerminacion = ComprobarNulos.CheckDateTimeNull(reader["VTerminacion"]);
                    dto.IdLicencia = ComprobarNulos.CheckIntNull(reader["IdLicencia"]);
                    dto.NombreLicencia = ComprobarNulos.CheckStringNull(reader["NombreLicencia"]);
                    dto.CantidadUsuarios = ComprobarNulos.CheckIntNull(reader["CantidadUsuarios"]);
                    dto.CantidadOportunidades = ComprobarNulos.CheckIntNull(reader["CantidadOportunidades"]);
                    dto.IdAdministrador = ComprobarNulos.CheckIntNull(reader["IdAdministrador"]);
                    dto.Administrador = ComprobarNulos.CheckStringNull(reader["Administrador"]);
                    dto.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                    dto.ApellidoPaterno = ComprobarNulos.CheckStringNull(reader["ApellidoPaterno"]);
                    dto.ApellidoMaterno = ComprobarNulos.CheckStringNull(reader["ApellidoMaterno"]);
                    dto.UsuarioAdministrador = ComprobarNulos.CheckStringNull(reader["UsuarioAdministrador"]);
                    dto.CorreoAdministrador = ComprobarNulos.CheckStringNull(reader["CorreoAdministrador"]);
                    dto.UserReal = ComprobarNulos.CheckIntNull(reader["UserReal"]);
                    dto.OportEmp = ComprobarNulos.CheckIntNull(reader["OportEmp"]);
                    dto.OportAct = ComprobarNulos.CheckIntNull(reader["OportunidadAct"]);
                    dto.Activo = ComprobarNulos.CheckIntNull(reader["Activo"]);
                    dto.UrlSitio = ComprobarNulos.CheckStringNull(reader["UrlSitio"]);

                    result.Add(dto);
                }
            }
            return result;
        }
        public async Task<List<AdminsEmpresaDto>> ConsultaAdminsEmpresas()
        {
            List<AdminsEmpresaDto> result = new List<AdminsEmpresaDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-ADMINISTRADORES"),
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_Tenant", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new AdminsEmpresaDto();
                    dto.IdMiembro = ComprobarNulos.CheckIntNull(reader["IdMiembro"]);
                    dto.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                    result.Add(dto);
                }
            }
            return result;
        }


        public async Task<List<ComboLicenciasDto>> ComboLicencias()
        {
            List<ComboLicenciasDto> result = new List<ComboLicenciasDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-LICENCIAS"),
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_Tenant", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ComboLicenciasDto();
                    dto.IdLicencia = ComprobarNulos.CheckIntNull(reader["IdLicencia"]);
                    dto.NombreLicencia = ComprobarNulos.CheckStringNull(reader["NombreLicencia"]);
                    result.Add(dto);
                }
            }
            return result;
        }
    }
}
