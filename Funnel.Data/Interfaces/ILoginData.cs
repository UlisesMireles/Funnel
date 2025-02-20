using Funnel.Models;
using Funnel.Models.Base;

namespace Funnel.Data.Interfaces
{
    public interface ILoginData
    {
        public Task<UsuarioLogin> Autenticar(string user, string contrasena);
        public Task<TwoFactor> TwoFactor(string usuario);
        public Task<UsuarioReset> ValidarUsuario(string usuario);
        public Task<string> ObtenerCuerpoCorreoReset(string usuario);
        public Task<BaseOut> ObtenerVersion();
        public Task<string> ObtenerFotoUsuario(string usuario);
    }
}
