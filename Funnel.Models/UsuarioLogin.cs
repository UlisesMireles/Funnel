﻿using Funnel.Models.Base;

namespace Funnel.Models
{
    public class UsuarioLogin : BaseOut
    {
        public int IdUsuario { get; set; }
        public string? TipoUsuario { get; set; }
    }


    public class UsuarioReset 
    {
        public int IdAdministrador { get; set; }
        public string? Usuario { get; set; }
        public string? Correo { get; set; }
        public string? Clave { get; set; }
        public bool? Activo { get; set; }
    }

    public class Usuario: BaseOut
    {
        public int IdUsuario { get; set; }
        public string? Username { get; set; }
        public string? Correo { get; set; }
        public string? TipoUsuario { get; set; }
        public string? RutaFoto { get; set; }
    }
}
