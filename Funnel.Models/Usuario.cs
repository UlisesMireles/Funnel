using Funnel.Models.Base;

namespace Funnel.Models
{
    public class Usuario : BaseOut
    {
        public int IdUsuario { get; set; }
        public string? TipoUsuario { get; set; }
        public string? Nombre { get; set; }
        public string? Correo { get; set; }
    }


    public class UsuarioReset 
    {
        public int IdAdministrador { get; set; }
        public string? Usuario { get; set; }
        public string? Correo { get; set; }
        public string? Clave { get; set; }
        public bool? Activo { get; set; }
    }

    public class UsuarioLogin
    {
        public string? Usuario { get; set; }
        public string? Pass { get; set; }
    }

    public class UsuarioDosPasos
    {
        public string? Usuario { get; set; }
        public int Codigo { get; set; }
    }
}
