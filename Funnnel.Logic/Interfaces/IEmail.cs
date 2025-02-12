using Funnel.Models.Base;

namespace Funnnel.Logic.Interfaces
{
    public interface IEmail
    {
        public BaseOut EnviarCorreo(string sTo, string sAsunto, string sMensaje);
    }
}
