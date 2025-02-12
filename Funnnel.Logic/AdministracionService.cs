using Funnel.Data.Interfaces;
using Funnel.Models;
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
    }
}
