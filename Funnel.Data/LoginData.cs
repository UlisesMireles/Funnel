using System.Data;
using Funnel.Models;
using Microsoft.Extensions.Configuration;
using Funnel.Data.Utils;
using Funnel.Data.Interfaces;

namespace Funnel.Data
{
    public class LoginData : ILoginData
    {
        private readonly string _connectionString;
        public LoginData(IConfiguration configuration) 
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<List<Prueba>> Prueba()
        {
            List<Prueba> lstPrueba = new List<Prueba>();
            using IDataReader reader =  await DataBase.GetReader("F_CatalogoUsuariosAdministrador", CommandType.StoredProcedure, _connectionString);
            while (reader.Read())
            {
                Prueba prueba = new()
                {
                    IdAdministrador = ComprobarNulos.CheckNull<int>(reader["IdAdministrador"]),
                    Usuario = ComprobarNulos.CheckNull<string>(reader["Usuario"]),
                };

                lstPrueba.Add(prueba);
            }
            return lstPrueba;
        }
    }
}
