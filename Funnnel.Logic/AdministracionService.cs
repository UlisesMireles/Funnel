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
