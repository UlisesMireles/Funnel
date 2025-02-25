using Funnel.Data.Interfaces;
using Funnel.Models;
using Funnel.Models.Base;
using Funnnel.Logic.Interfaces;

namespace Funnnel.Logic
{
    public class LicenciaService : ILicenciaService
    {
        private readonly ILicenciaData _licenciaData;
        public LicenciaService( ILicenciaData licenciaData)
        {
            _licenciaData = licenciaData;
        }
        public async Task<BaseOut> GuardarLicencia(GuardarLicenciaDto request)
        {
            return await _licenciaData.GuardarLicencia(request);
        }
        public async Task<List<LicenciaDto>> ConsultarLicencias()
        {
            return await _licenciaData.ConsultarLicencias();
        }

    }
}
