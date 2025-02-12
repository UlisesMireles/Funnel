using Funnel.Models;

namespace Funnnel.Logic.Interfaces
{
    public interface IAdministracionService
    {
        public Task<List<Administrador>> CatalogoAdministradores();
    }
}
