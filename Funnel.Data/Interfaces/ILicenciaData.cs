using Funnel.Models;
using Funnel.Models.Base;

namespace Funnel.Data.Interfaces
{
    public interface ILicenciaData
    {
        public Task<List<LicenciaDto>> ConsultarLicencias();
        public Task<BaseOut> GuardarLicencia(GuardarLicenciaDto request);
    }
}
