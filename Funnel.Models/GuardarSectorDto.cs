namespace Funnel.Models
{
    public class GuardarSectorDto
    {
        public string? Bandera { get; set; }
        public int IdSector { get; set; }
        public string? NombreSector { get; set; }
        public string? DescripcionSector { get; set; }
        public int IdUsuarioCreador { get; set; }
        public int Activo { get; set; }

    }
}
