using Funnel.Models.Base;

namespace Funnel.Models
{
    public class TwoFactor : BaseOut
    {
        public int Codigo { get; set; }
        public int TipoMensaje { get; set; }
    }
}
