namespace Funnel.Models
{
    public class  LicenciaDto
    {
        public int IdLicencia { get; set; }
        public string? NombreLicencia { get; set; }
        public int CantidadUsuarios{ get; set; }
        public int CantidadOportunidades{ get; set; }
        public int CantidadProcesosPermitidos { get; set; }
        public int Activo { get; set; }
    }
}
