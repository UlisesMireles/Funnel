using Funnel.Data.Interfaces;
using Funnel.Models;
using Funnel.Models.Base;
using Funnnel.Logic.Interfaces;

namespace Funnnel.Logic
{
    public class AdministracionService : IAdministracionService
    {
        private readonly IAdministracionData _administracionData;
        public AdministracionService(IAdministracionData administracionData) 
        {
            _administracionData = administracionData;
        }

        public async Task<BaseOut> CambiarPass(UsuarioData user)
        {
            return await _administracionData.CambiarPass(user);
        }

        public async Task<BaseOut> CambiarPassTwoFactor(string usuario)
        {
            return await _administracionData.CambiarPassTwoFactor(usuario);
        }

        public async Task<List<Administrador>> CatalogoAdministradores()
        {
            return await _administracionData.CatalogoAdministradores();
        }

        public async Task<BaseOut> InsertaAdministrador(Administrador admin)
        {
            return await _administracionData.InsertaAdministrador(admin);
        }

        public async Task<BaseOut> ModificaAdministrador(Administrador admin)
        {
            return await _administracionData.ModificaAdministrador(admin);
        }

        public async Task<Administrador> ObtenerAdministradorPorUsuario(string user)
        {
            return await _administracionData.ObtenerAdministradorPorUsuario(user);
        }
    }
}
