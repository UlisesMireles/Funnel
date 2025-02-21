using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models;
using Funnel.Models.Base;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace Funnel.Data
{
    public class AdministracionData : IAdministracionData
    {
        private readonly string? _connectionString;
        public AdministracionData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<List<Administrador>> CatalogoAdministradores()
        {
            var administradores = new List<Administrador>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-ADMINISTRADOR")
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_AdministradoresTenant", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var administrador = new Administrador();
                    administrador.IdAdministrador = ComprobarNulos.CheckIntNull(reader["IdAdministrador"]);
                    administrador.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                    administrador.Usuario = ComprobarNulos.CheckStringNull(reader["Usuario"]);
                    administrador.CorreoElectronico = ComprobarNulos.CheckStringNull(reader["CorreoElectronico"]);
                    administrador.DescActivo = ComprobarNulos.CheckStringNull(reader["DesEstatusActivo"]);
                    administrador.Activo = ComprobarNulos.CheckIntNull(reader["Activo"]);
                    administradores.Add(administrador);
                }
            }
            return administradores;
        }

        public async Task<Administrador> ObtenerAdministradorPorUsuario(string user)
        {
            var administrador = new Administrador();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-ADMINISTRADOR-BY-USERNAME"),
                DataBase.CreateParameterSql("@pUsuario", SqlDbType.VarChar, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, user)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_AdministradoresTenant", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    administrador.IdAdministrador = ComprobarNulos.CheckIntNull(reader["IdAdministrador"]);
                    administrador.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                    administrador.Usuario = ComprobarNulos.CheckStringNull(reader["Usuario"]);
                    administrador.CorreoElectronico = ComprobarNulos.CheckStringNull(reader["CorreoElectronico"]);
                    administrador.Activo = ComprobarNulos.CheckIntNull(reader["Activo"]);
                }
            }
            return administrador;
        }

        public async Task<BaseOut> InsertaAdministrador(Administrador admin)
        {
            var result = new BaseOut();
            result.Result = false;
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "INS-ADMINISTRADOR"),
                    DataBase.CreateParameterSql("@pNombre", SqlDbType.VarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, admin.Nombre),
                    DataBase.CreateParameterSql("@pUsuario", SqlDbType.VarChar, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, admin.Usuario),
                    DataBase.CreateParameterSql("@pCorreoElectronico", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, admin.CorreoElectronico),
                    DataBase.CreateParameterSql("@pActivo", SqlDbType.Int, 1, ParameterDirection.Input, false, null, DataRowVersion.Default, 1)
                };
                using (IDataReader reader = await DataBase.GetReaderSql("F_AdministradoresTenant", CommandType.StoredProcedure, list, _connectionString))
                {
                    result.Result = true;
                }
            }
            catch (Exception ex)
            {
                result.Result = false;
                result.ErrorMessage = ex.Message;
            }
            return result;
        }

        public async Task<BaseOut> ModificaAdministrador(Administrador admin)
        {
            var result = new BaseOut();
            result.Result = false;
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "UPD-ADMINISTRADOR"),
                    DataBase.CreateParameterSql("@pIdAdministrador", SqlDbType.Int, 2, ParameterDirection.Input, false, null, DataRowVersion.Default, admin.IdAdministrador),
                    DataBase.CreateParameterSql("@pNombre", SqlDbType.VarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, admin.Nombre),
                    DataBase.CreateParameterSql("@pUsuario", SqlDbType.VarChar, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, admin.Usuario),
                    DataBase.CreateParameterSql("@pCorreoElectronico", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, admin.CorreoElectronico),
                    DataBase.CreateParameterSql("@pActivo", SqlDbType.Int, 1, ParameterDirection.Input, false, null, DataRowVersion.Default, admin.Activo)
                };
                using (IDataReader reader = await DataBase.GetReaderSql("F_AdministradoresTenant", CommandType.StoredProcedure, list, _connectionString))
                {
                    result.Result = true;
                }
            }
            catch (Exception ex)
            {
                result.Result = false;
                result.ErrorMessage = ex.Message;
            }
            return result;
        }

        public async Task<BaseOut> CambiarPassTwoFactor(string usuario)
        {
            BaseOut result = new BaseOut();
            try
            {
                IList<Parameter> listaParametros = new List<Parameter>
                {
                    DataBase.CreateParameter("@pUsuario", DbType.String, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, usuario)
                };
                using (IDataReader reader = await DataBase.GetReader("F_CambiarContrasenaDosPasosTenant", CommandType.StoredProcedure, listaParametros, _connectionString))
                {
                    while (reader.Read())
                    {
                        result.Result = ComprobarNulos.CheckBooleanNull(reader["Result"]);
                        result.ErrorMessage = ComprobarNulos.CheckStringNull(reader["Error"]);
                    }
                }
            }
            catch (Exception ex)
            {
                result.Result = false;
                result.ErrorMessage = ex.Message;
            }

            return result;
        }

        public async Task<BaseOut> CambiarPass(UsuarioReset user)
        {
            BaseOut result = new BaseOut();
            try
            {
                IList<Parameter> listaParametros = new List<Parameter>
                {
                    DataBase.CreateParameter("@pUsuario", DbType.String, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, user.Usuario),
                    DataBase.CreateParameter("@pPass", DbType.String, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, Encrypt.Encriptar(user.Clave)),
                };
                using (IDataReader reader = await DataBase.GetReader("F_CambiarContrasenaTenant", CommandType.StoredProcedure, listaParametros, _connectionString))
                {
                    while (reader.Read())
                    {
                        result.Result = ComprobarNulos.CheckBooleanNull(reader["Result"]);
                        result.ErrorMessage = ComprobarNulos.CheckStringNull(reader["ErrorMessage"]);
                    }
                }
            }
            catch (Exception ex)
            {
                result.Result = false;
                result.ErrorMessage = ex.Message;
            }
            return result;
        }
    }
}
