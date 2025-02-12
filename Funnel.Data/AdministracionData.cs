using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models;
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
                    administrador.Usuario = ComprobarNulos.CheckStringNull(reader["Usuario"]);
                    administrador.CorreoElectronico = ComprobarNulos.CheckStringNull(reader["CorreoElectronico"]);
                    administrador.DescActivo = ComprobarNulos.CheckStringNull(reader["DesEstatusActivo"]);
                    administrador.Activo = ComprobarNulos.CheckBooleanNull(reader["Activo"]);
                    administradores.Add(administrador);
                }
            }
            return administradores;
        }
    }
}
