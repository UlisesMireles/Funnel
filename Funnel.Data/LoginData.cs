using System.Data;
using Funnel.Models;
using Microsoft.Extensions.Configuration;
using Funnel.Data.Utils;
using Funnel.Data.Interfaces;
using System.Reflection.PortableExecutable;
using Funnel.Models.Base;

namespace Funnel.Data
{
    public class LoginData : ILoginData
    {
        private readonly string _connectionString;
        public LoginData(IConfiguration configuration) 
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<UsuarioLogin> Autenticar(string user, string contrasena)
        {
            UsuarioLogin usuario = new UsuarioLogin();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pUsuario", SqlDbType.NVarChar, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, user),
                    DataBase.CreateParameterSql("@pPassword", SqlDbType.NVarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, contrasena)
                };
                using (IDataReader reader = await DataBase.GetReaderSql("F_AutentificacionTenantDosPasos", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        usuario.IdUsuario = ComprobarNulos.CheckIntNull(reader["IdAdministrador"]);
                        usuario.TipoUsuario = "Tenant";
                        usuario.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                        usuario.Correo = ComprobarNulos.CheckStringNull(reader["Correo"]);
                        usuario.Result = ComprobarNulos.CheckBooleanNull(reader["Result"]);
                        usuario.ErrorMessage = ComprobarNulos.CheckStringNull(reader["Error"]);
                    }
                }                    
            }
            catch (Exception ex)
            {
                usuario.Result = false;
                usuario.ErrorMessage = ex.Message;
            }            
            return usuario;
        }

        public async Task<TwoFactor> TwoFactor(string usuario)
        {
            TwoFactor twoFactorDto = new TwoFactor();
            try
            {
                IList<Parameter> listaParametros = new List<Parameter>
                {
                    DataBase.CreateParameter("@pUsuario", DbType.String, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, usuario),
                    DataBase.CreateParameter("@pCodigo", DbType.String, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, twoFactorDto.Codigo),
                };
                using (IDataReader reader = await DataBase.GetReader("F_CodigoAutentificacionTenant", CommandType.StoredProcedure, listaParametros, _connectionString))
                {
                    while (reader.Read())
                    {
                        twoFactorDto.Result = ComprobarNulos.CheckBooleanNull(reader["Result"]);
                        twoFactorDto.ErrorMessage = ComprobarNulos.CheckStringNull(reader["ErrorMessage"]);
                        twoFactorDto.TipoMensaje = ComprobarNulos.CheckIntNull(reader["TipoMensaje"]);
                    }
                }
            }
            catch (Exception ex)
            {
                twoFactorDto.Result = false;
                twoFactorDto.ErrorMessage = ex.Message;
            }

            return twoFactorDto;
        }        

        public async Task<UsuarioReset> ValidarUsuario(string usuario)
        {
            UsuarioReset user = new UsuarioReset();
            IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-ADMINISTRADOR-BY-USERNAME"),
                    DataBase.CreateParameterSql("@pIdAdministrador", SqlDbType.Int, 5, ParameterDirection.Input, false, null, DataRowVersion.Default, 0),
                    DataBase.CreateParameterSql("@pNombre", SqlDbType.VarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, DBNull.Value),
                    DataBase.CreateParameterSql("@pUsuario", SqlDbType.VarChar, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, usuario),
                    DataBase.CreateParameterSql("@pCorreoElectronico", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, DBNull.Value),
                    DataBase.CreateParameterSql("@pActivo", SqlDbType.Int, 1, ParameterDirection.Input, false, null, DataRowVersion.Default, 0)
                };
            using (IDataReader reader = await DataBase.GetReaderSql("F_AdministradoresTenant", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    user.IdAdministrador = ComprobarNulos.CheckIntNull(reader["IdAdministrador"]);
                    user.Usuario = ComprobarNulos.CheckStringNull(reader["Usuario"]);
                    user.Correo = ComprobarNulos.CheckStringNull(reader["CorreoElectronico"]);
                    user.Clave = ComprobarNulos.CheckStringNull(reader["Clave"]);
                    user.Activo = ComprobarNulos.CheckBooleanNull(reader["Activo"]);
                }
            }
            return user;
        }



        public async Task<string> ObtenerCuerpoCorreoReset(string usuario)
        {
            string cuerpo = string.Empty;
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "NOTIFICACION-RESET-TENANT"),
                    DataBase.CreateParameterSql("@pUsuario", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, usuario),
                    DataBase.CreateParameterSql("@pNombre", SqlDbType.VarChar, 40, ParameterDirection.Input, false, null, DataRowVersion.Default, DBNull.Value),
                    DataBase.CreateParameterSql("@pApellidoPat", SqlDbType.VarChar, 40, ParameterDirection.Input, false, null, DataRowVersion.Default, DBNull.Value),
                    DataBase.CreateParameterSql("@pApellidoMat", SqlDbType.VarChar, 40, ParameterDirection.Input, false, null, DataRowVersion.Default, DBNull.Value)
                };
                using (IDataReader reader = await DataBase.GetReaderSql("F_NotificacionCorreo", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        cuerpo = ComprobarNulos.CheckStringNull(reader["CuerpoCorreo"]);
                    }
                }
            }
            catch (Exception ex)
            {
                cuerpo = "Error";
            }
            return cuerpo;
        }

        public async Task<BaseOut> ObtenerVersion()
        {
            BaseOut version = new BaseOut();
            using (IDataReader reader = await DataBase.GetReader("F_VersionTenant", CommandType.StoredProcedure,  _connectionString))
            {
                while (reader.Read())
                {
                    version.Result = true;
                    version.ErrorMessage = ComprobarNulos.CheckStringNull(reader["Version"]);
                }
            }
            return version;
        }

        public async Task<string> ObtenerUsuarioByUser(string usuario)
        {
            string foto = string.Empty;
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SELECT-FOTO"),
                DataBase.CreateParameterSql("@Usuario", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, usuario)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoUsuarios", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    foto = ComprobarNulos.CheckStringNull(reader["NombreImg"]);
                }
            }
            return foto;
        }

        public async Task<string> ObtenerFotoUsuario(string usuario)
        {
            string foto = string.Empty;
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SELECT-FOTO"),
                DataBase.CreateParameterSql("@Usuario", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, usuario)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoUsuarios", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    foto = ComprobarNulos.CheckStringNull(reader["NombreImg"]);
                }
            }
            return foto;
        }

    }
}
