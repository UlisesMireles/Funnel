namespace Funnel.Models
{
    public class INS_UPD_Empresa
    {
        public string Bandera { get; set; }
        public int IdEmpresa { get; set; }
        public string NombreEmpresa { get; set; }
        public int IdAdministrador { get; set; }
        public int IdLicencia { get; set; }
        public string Alias { get; set; }
        public string RFC { get; set; }
        public DateTime VInicio { get; set; }
        public DateTime VTerminacion { get; set; }
        public int UsuarioCreador { get; set; }
        public string Nombre { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string Iniciales { get; set; }
        public string Correo { get; set; }
        public string Usuario { get; set; }
        public string UrlSitio { get; set; }
        public int Activo { get; set; }
    }
}
