using System.Data;
using Funnel.Models;
using Microsoft.Extensions.Configuration;
using Funnel.Data.Utils;
using Funnel.Data.Interfaces;
using Funnel.Models.Base;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Funnel.Models.Dto;

namespace Funnel.Data
{
    public class EmpresaData : IEmpresaData
    {
        private readonly string _connectionString;
        public EmpresaData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<BaseOut> GuardarImagenEmpresa(List<IFormFile> imagen, GuardarEmpresaDto request)
        {
            BaseOut result = new BaseOut();
            var formatosPermitidos = new List<string> { ".jpg", ".png", ".jpeg" };
            string carpetaDestino = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "LogosEmpresas");

            try
            {
                if (!Directory.Exists(carpetaDestino))
                {
                    Directory.CreateDirectory(carpetaDestino);
                }

                // Procesar imagen primero
                if (imagen != null && imagen.Any())
                {
                    foreach (var file in imagen)
                    {
                        var extension = Path.GetExtension(file.FileName).ToLower();

                        if (!formatosPermitidos.Contains(extension))
                        {
                            result.ErrorMessage = $"Formato de archivo {extension} no permitido.";
                            result.Result = false;
                            return result;
                        }

                        var nombreBase = $"{request.Alias}_{request.IdEmpresa}";
                        var nombreArchivoNuevo = $"{nombreBase}{extension}";
                        var rutaArchivoNuevo = Path.Combine(carpetaDestino, nombreArchivoNuevo);

                        // Eliminar imágenes anteriores
                        foreach (var formato in formatosPermitidos)
                        {
                            var rutaAnterior = Path.Combine(carpetaDestino, $"{nombreBase}{formato}");
                            if (File.Exists(rutaAnterior))
                            {
                                File.Delete(rutaAnterior);
                            }
                        }

                        using (var stream = new FileStream(rutaArchivoNuevo, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        request.ArchivoImagen = nombreArchivoNuevo;
                    }
                }

                // Guardar la empresa con la imagen
                var resultado = await GuardarEmpresa(request);

                result.Result = resultado.Result;
                result.ErrorMessage = resultado.ErrorMessage;
                result.Id = resultado.Id;
            }
            catch (Exception ex)
            {
                result.ErrorMessage = "Error al guardar la empresa: " + ex.Message;
                result.Result = false;
            }

            return result;
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
                    DataBase.CreateParameterSql("@pActivo", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.activo),
                    DataBase.CreateParameterSql("@pArchivoImagen", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.ArchivoImagen ?? (object)DBNull.Value)
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
                        await ActualizarLogoEmpresa(request.IdEmpresa, request.ArchivoImagen);
                        result.ErrorMessage = "La empresa se actualizó correctamente.";
                        result.Id = 1;
                        result.Result = true;
                        break;
                    case "INS-EMPRESA":
                        await ActualizarLogoEmpresa(result.Id, request.ArchivoImagen);
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

        public async Task<BaseOut> ActualizarLogoEmpresa(int? idEmpresa, string nombreArchivoNuevo)
        {
            BaseOut result = new BaseOut();

            try
            {
                IList<ParameterSQl> parametros = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "UPDATE-LOGO"),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, idEmpresa),
                    DataBase.CreateParameterSql("@pArchivoImagen", SqlDbType.VarChar, 300, ParameterDirection.Input, false, null, DataRowVersion.Default, nombreArchivoNuevo)
                };

                using (IDataReader reader = await DataBase.GetReaderSql("F_Tenant", CommandType.StoredProcedure, parametros, _connectionString))
                {
                    while (reader.Read())
                    {

                    }
                }

                result.Result = true;
                result.ErrorMessage = "Imagen actualizada correctamente.";
                result.Id = idEmpresa.Value;
            }
            catch (Exception ex)
            {
                result.Result = false;
                result.ErrorMessage = "Error al actualizar la imagen: " + ex.Message;
            }

            return result;
        }
    }
}
