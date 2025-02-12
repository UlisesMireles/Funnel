using Funnel.Models;

namespace Funnel.Data.Interfaces
{
    public interface IAdministracionData
    {
        public Task<List<Administrador>> CatalogoAdministradores();
    }
}
