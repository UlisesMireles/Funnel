namespace Funnel.Models
{
    public class INS_UPD_Licencia
    {
        public string bandera { get; set; }
        public int IdLicencia { get; set; }
        public string NombreLicencia{ get; set; }
        public int CantidadUsuarios { get; set; }
        public int CantidadOportunidades { get; set; }
        public int IdUsuarioCreador { get; set; }
    }
}
