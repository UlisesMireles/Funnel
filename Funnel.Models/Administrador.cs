using Funnel.Models.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models
{
    public class Administrador
    {
        public int IdAdministrador { get; set; }
        public string? Nombre { get; set; }
        public string? Usuario { get; set; }
        public string? CorreoElectronico { get; set; }
        public bool Activo {  get; set; }
        public string? DescActivo { get; set; }
    }
}
