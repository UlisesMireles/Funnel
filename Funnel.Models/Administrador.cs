namespace Funnel.Models
{
    public class Administrador
    {
        public int IdAdministrador { get; set; }
        public string? Nombre { get; set; }
        public string? Usuario { get; set; }
        public string? CorreoElectronico { get; set; }
        public int Activo {  get; set; }
        public string? DescActivo { get; set; }
    }
}
