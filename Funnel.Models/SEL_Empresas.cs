
namespace Funnel.Models
{
    public class SEL_Empresas
    {
        public int IdEmpresa { get; set; }
        public string? NombreEmpresa { get; set; }
        public string? Alias { get; set; }
        public string? RFC { get; set; }
        public DateTime VInicio { get; set; }
        public DateTime VTerminacion { get; set; }
        public int IdLicencia { get; set; }
        public string? NombreLicencia { get; set; }
        public int CantidadUsuarios { get; set; }
        public int CantidadOportunidades { get; set; }
        public string? Administrador { get; set; }
        public int IdAdministrador { get; set; }
        public string? Nombre { get; set; }
        public string? ApellidoPaterno { get; set; }
        public string? ApellidoMaterno { get; set; }
        public string? UsuarioAdministrador { get; set; }
        public string? CorreoAdministrador { get; set; }
        public int UserReal { get; set; }
        public int OportEmp { get; set; }
        public int OportAct { get; set; }
        public string? UrlSitio { get; set; }
        public int Activo { get; set; }
        public int UsuarioCreador { get; set; }

    }
}
