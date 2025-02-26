namespace Funnel.Models
{
    public class SectoresDto
    {
        public int IdSector { get; set; }
        public string? NombreSector { get; set; }
        public string? DescripcionSector { get; set; }
        public string? FechaCreacion { get; set; }
        public string? UsuarioCreador { get; set; }
        public string? FechaModificacion { get; set; }
        public string? UsuarioModifico { get; set; }
        public string? DesEstatusActivo{ get; set; }
    }
}
