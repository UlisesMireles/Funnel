namespace Funnel.Models
{
    public class Stats
    {
        public string Empresa { get; set; }
        public int UsuariosActivos { get; set; }
        public int UsuariosRegistrados { get; set; }
        public int OportunidadesActivas { get; set; }
        public int OportunidadesRegistradas { get; set; }
        public bool Estatus { get; set; }
        public string DescripcionEstatus { get; set; }
    }
}
