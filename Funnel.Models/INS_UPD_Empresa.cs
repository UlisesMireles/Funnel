namespace Funnel.Models
{
    public class INS_UPD_Empresa
    {
        public string bandera { get; set; }
        public int idEmpresa { get; set; }
        public string nombreEmpresa { get; set; }
        public int idAdministrador { get; set; }
        public int idLicencia { get; set; }
        public string alias { get; set; }
        public string rfc { get; set; }
        public DateTime vInicio { get; set; }
        public DateTime vTerminacion { get; set; }
        public int usuarioCreador { get; set; }
        public string nombre { get; set; }
        public string apellidoPaterno { get; set; }
        public string apellidoMaterno { get; set; }
        public string iniciales { get; set; }
        public string correo { get; set; }
        public string usuario { get; set; }
        public string urlSitio { get; set; }
        public int activo { get; set; }
    }
}
