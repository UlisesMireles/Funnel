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
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "TENANT"),
                    DataBase.CreateParameterSql("@Username", SqlDbType.NVarChar, 255, ParameterDirection.Input, false, null, DataRowVersion.Default, user),
                    DataBase.CreateParameterSql("@Password", SqlDbType.NVarChar, 255, ParameterDirection.Input, false, null, DataRowVersion.Default, contrasena)
                };
                using (IDataReader reader = await DataBase.GetReaderSql("Authenticate", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        usuario.IdUsuario = ComprobarNulos.CheckIntNull(reader["IdUsuario"]);
                        usuario.TipoUsuario = ComprobarNulos.CheckStringNull(reader["Descripcion"]);
                        usuario.Result = true;
                        usuario.ErrorMessage = string.Empty;
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
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-VERSION"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 5, ParameterDirection.Input, false, null, DataRowVersion.Default, 0)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_Catalogos", CommandType.StoredProcedure, list, _connectionString))
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
