
using Funnel.Models;
using Funnel.Models.Base;

namespace Funnnel.Logic.Interfaces
{
    public interface ILoginService
    {
        public Task<UsuarioLogin> Autenticar(string user, string contrasena);
        public Task<TwoFactor> TwoFactor(string usuario);
        public Task<BaseOut> ResetPassword(string usuario);
        public Task<BaseOut> ObtenerVersion();
    }
}
