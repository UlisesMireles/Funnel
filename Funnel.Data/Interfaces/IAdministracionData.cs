using Funnel.Models;
using Funnel.Models.Base;

namespace Funnel.Data.Interfaces
{
    public interface IAdministracionData
    {
        public Task<List<Administrador>> CatalogoAdministradores();
        public Task<BaseOut> InsertaAdministrador(Administrador admin);
        public Task<BaseOut> ModificaAdministrador(Administrador admin);
        public Task<Administrador> ObtenerAdministradorPorUsuario(string user);
    }
}
