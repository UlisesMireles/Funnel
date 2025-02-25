using Funnel.Models;
using Funnel.Models.Base;

namespace Funnnel.Logic.Interfaces
{
    public interface ILicenciaService
    {
        public Task<BaseOut> GuardarLicencia(GuardarLicenciaDto request);
        public Task<List<LicenciaDto>> ConsultarLicencias();
    }
}
