using Funnel.Models;
using Funnel.Models.Base;

namespace Funnnel.Logic.Interfaces
{
    public interface IAdministracionService
    {
        public Task<List<Administrador>> CatalogoAdministradores();
        public Task<Administrador> ObtenerAdministradorPorUsuario(string user);
        public Task<BaseOut> InsertaAdministrador(Administrador admin);
        public Task<BaseOut> ModificaAdministrador(Administrador admin);
        public Task<BaseOut> CambiarPassTwoFactor(string usuario);
        public Task<BaseOut> CambiarPass(UsuarioData user);
    }
}
